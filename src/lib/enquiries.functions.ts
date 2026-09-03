import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const submitEnquirySchema = z.object({
  supplierId: z.string().uuid().optional(),
  venueId: z.string().uuid().optional(),
  kind: z.enum(["listing_enquiry", "business_listing_request", "contact"]).default("listing_enquiry"),
  listingName: z.string().optional(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(80).optional(),
  weddingDate: z.string().trim().max(30).optional(),
  guestCount: z.number().int().min(1).max(5000).optional(),
  message: z.string().trim().min(1).max(5000),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

function emptyToNull(value?: string) {
  return value && value.trim() ? value.trim() : null;
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .validator((d: unknown) => submitEnquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { sql } = await import("@/lib/postgres.server");
    const db = sql();

    await db`
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
        ${emptyToNull(data.weddingDate)},
        ${data.guestCount ?? null},
        ${data.message},
        ${data.metadata ?? {}}
      )
    `;

    return { ok: true };
  });
