import { createServerFn } from "@tanstack/react-start";
import type postgres from "postgres";
import { z } from "zod";
import {
  adminEmailRecipients,
  escapeHtml,
  isTransactionalEmailConfigured,
  parseRecipients,
  sendTransactionalEmail,
} from "@/lib/email.server";

type Db = postgres.Sql;

const submitEnquirySchema = z.object({
  supplierId: z.string().uuid().optional(),
  venueId: z.string().uuid().optional(),
  kind: z
    .enum(["listing_enquiry", "business_listing_request", "contact"])
    .default("listing_enquiry"),
  listingName: z.string().optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(80).optional(),
  weddingDate: z.string().trim().max(30).optional(),
  guestCount: z.number().int().min(1).max(5000).optional(),
  message: z.string().trim().min(1).max(5000),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

function emptyToNull(value?: string) {
  return value && value.trim() ? value.trim() : null;
}

function rows(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  return `${label}: ${value}\n`;
}

function htmlRows(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</p>`;
}

function subjectFor(data: z.infer<typeof submitEnquirySchema>) {
  if (data.kind === "business_listing_request") {
    return `New WedHQ listing request: ${data.listingName || data.name}`;
  }
  if (data.kind === "contact") {
    return `New WedHQ contact message from ${data.name}`;
  }
  return `New WedHQ enquiry for ${data.listingName || "a listing"}`;
}

function emailBody(data: z.infer<typeof submitEnquirySchema>) {
  const metadata = data.metadata ?? {};
  const metadataText = Object.entries(metadata)
    .filter(([, value]) => value !== null && value !== "")
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join("\n");

  const text = [
    subjectFor(data),
    "\n\n",
    rows("Listing", data.listingName),
    rows("Name", data.name),
    rows("Email", data.email),
    rows("Phone", data.phone),
    rows("Wedding date", data.weddingDate),
    rows("Guest count", data.guestCount),
    "Message:\n",
    data.message,
    metadataText ? `\n\nExtra details:\n${metadataText}` : "",
  ]
    .join("")
    .trim();

  const metadataHtml = Object.entries(metadata)
    .filter(([, value]) => value !== null && value !== "")
    .map(([key, value]) => htmlRows(key, String(value)))
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#1f2933">
      <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(subjectFor(data))}</h1>
      ${htmlRows("Listing", data.listingName)}
      ${htmlRows("Name", data.name)}
      ${htmlRows("Email", data.email)}
      ${htmlRows("Phone", data.phone)}
      ${htmlRows("Wedding date", data.weddingDate)}
      ${htmlRows("Guest count", data.guestCount)}
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      ${metadataHtml ? `<h2 style="font-size:16px;margin-top:20px">Extra details</h2>${metadataHtml}` : ""}
    </div>
  `;

  return { text, html };
}

async function listingRecipient(db: Db, data: z.infer<typeof submitEnquirySchema>) {
  if (data.kind !== "listing_enquiry") return [];

  if (data.supplierId) {
    const rows = await db<{ email: string | null }[]>`
      SELECT email
      FROM suppliers
      WHERE id = ${data.supplierId}
      LIMIT 1
    `;
    return parseRecipients(rows[0]?.email);
  }

  if (data.venueId) {
    const rows = await db<{ email: string | null }[]>`
      SELECT email
      FROM venues
      WHERE id = ${data.venueId}
      LIMIT 1
    `;
    return parseRecipients(rows[0]?.email);
  }

  return [];
}

async function sendEnquiryNotifications(db: Db, data: z.infer<typeof submitEnquirySchema>) {
  if (!isTransactionalEmailConfigured()) {
    return { status: "not_configured", error: null };
  }

  const adminRecipients = adminEmailRecipients();
  const listingRecipients = await listingRecipient(db, data);
  const recipients = Array.from(new Set([...listingRecipients, ...adminRecipients]));

  if (!recipients.length) {
    return { status: "no_recipient", error: null };
  }

  const body = emailBody(data);
  const result = await sendTransactionalEmail({
    to: recipients,
    subject: subjectFor(data),
    text: body.text,
    html: body.html,
    replyTo: data.email,
  });

  if (!result.ok) {
    return { status: "failed", error: result.error ?? result.reason };
  }

  return { status: "sent", error: null };
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((d: unknown) => submitEnquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/postgres.server");
    const db = sql();

    const [enquiry] = await db<{ id: string }[]>`
      INSERT INTO enquiries (
        supplier_id,
        venue_id,
        kind,
        listing_name,
        name,
        email,
        phone,
        wedding_date,
        guest_count,
        message,
        metadata
      )
      VALUES (
        ${data.supplierId ?? null},
        ${data.venueId ?? null},
        ${data.kind},
        ${emptyToNull(data.listingName)},
        ${data.name},
        ${data.email},
        ${emptyToNull(data.phone)},
        ${emptyToNull(data.weddingDate)}::date,
        ${data.guestCount ?? null},
        ${data.message},
        ${JSON.stringify(data.metadata ?? {})}::jsonb
      )
      RETURNING id
    `;

    const notification = await sendEnquiryNotifications(db, data);

    await db`
      UPDATE enquiries
      SET email_status = ${notification.status},
          email_sent_at = ${notification.status === "sent" ? new Date() : null},
          email_error = ${notification.error}
      WHERE id = ${enquiry.id}
    `;

    return { ok: true, emailStatus: notification.status };
  });
