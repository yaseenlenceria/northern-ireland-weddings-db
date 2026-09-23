import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  adminEmailRecipients,
  escapeHtml,
  isTransactionalEmailConfigured,
  sendTransactionalEmail,
} from "@/lib/email.server";

const submitLeadSchema = z.object({
  kind: z.enum(["audit", "checklist", "contact"]),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  businessName: z.string().trim().max(160).optional(),
  website: z.string().trim().max(300).optional(),
  category: z.string().trim().max(120).optional(),
  county: z.string().trim().max(120).optional(),
  challenge: z.string().trim().max(300).optional(),
  message: z.string().trim().max(5000).optional(),
});

type LeadData = z.infer<typeof submitLeadSchema>;

const KIND_SUBJECTS: Record<LeadData["kind"], string> = {
  audit: "New free SEO audit request",
  checklist: "New wedding SEO checklist download",
  contact: "New Vow Visibility contact message",
};

function rows(label: string, value?: string | null) {
  if (!value) return "";
  return `${label}: ${value}\n`;
}

function htmlRows(label: string, value?: string | null) {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

function buildEmail(data: LeadData) {
  const lines = [
    rows("Name", data.name),
    rows("Business", data.businessName),
    rows("Email", data.email),
    rows("Website", data.website),
    rows("Category", data.category),
    rows("County / service area", data.county),
    rows("Main challenge", data.challenge),
    rows("Message", data.message),
  ]
    .filter(Boolean)
    .join("");

  const htmlLines = [
    htmlRows("Name", data.name),
    htmlRows("Business", data.businessName),
    htmlRows("Email", data.email),
    htmlRows("Website", data.website),
    htmlRows("Category", data.category),
    htmlRows("County / service area", data.county),
    htmlRows("Main challenge", data.challenge),
    htmlRows("Message", data.message),
  ]
    .filter(Boolean)
    .join("");

  return { text: `${KIND_SUBJECTS[data.kind]}\n\n${lines}`, html: htmlLines };
}

export const submitLead = createServerFn({ method: "POST" })
  .validator((d: unknown) => submitLeadSchema.parse(d))
  .handler(async ({ data }) => {
    console.log(`[lead:${data.kind}]`, JSON.stringify(data));

    if (!isTransactionalEmailConfigured()) {
      console.warn("Transactional email not configured — lead logged only.");
      return { ok: true as const, notified: false };
    }

    const recipients = adminEmailRecipients();
    if (!recipients.length) {
      console.warn("No admin email recipient configured — lead logged only.");
      return { ok: true as const, notified: false };
    }

    const body = buildEmail(data);
    const result = await sendTransactionalEmail({
      to: recipients,
      subject: `${KIND_SUBJECTS[data.kind]} — ${data.businessName || data.name}`,
      text: body.text,
      html: body.html,
      replyTo: data.email,
    });

    if (!result.ok) {
      console.error("Lead notification email failed:", result.reason, result.error);
      return { ok: true as const, notified: false };
    }

    return { ok: true as const, notified: true };
  });
