type EmailMessage = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

type EmailSendResult =
  | { ok: true; providerId?: string }
  | {
      ok: false;
      reason: "not_configured" | "invalid_recipient" | "provider_error";
      error?: string;
    };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function adminEmailRecipients() {
  return parseRecipients(
    process.env["WEDHQ_ADMIN_EMAIL"] ?? process.env["CONTACT_EMAIL"] ?? process.env["EMAIL_TO"],
  );
}

export function isTransactionalEmailConfigured() {
  return Boolean(process.env["RESEND_API_KEY"] && fromAddress());
}

export function parseRecipients(value?: string | null) {
  return Array.from(
    new Set(
      (value ?? "")
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter((item) => emailPattern.test(item)),
    ),
  );
}

export function fromAddress() {
  return process.env["EMAIL_FROM"] ?? process.env["RESEND_FROM"] ?? "";
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendTransactionalEmail(message: EmailMessage): Promise<EmailSendResult> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = fromAddress();
  const to = Array.isArray(message.to) ? message.to : [message.to];
  const recipients = to.map((item) => item.trim()).filter((item) => emailPattern.test(item));

  if (!apiKey || !from) {
    return { ok: false, reason: "not_configured" };
  }

  if (!recipients.length) {
    return { ok: false, reason: "invalid_recipient" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: recipients,
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to:
          message.replyTo && emailPattern.test(message.replyTo) ? message.replyTo : undefined,
      }),
    });

    const body = (await response.json().catch(() => null)) as {
      id?: string;
      message?: string;
    } | null;

    if (!response.ok) {
      return {
        ok: false,
        reason: "provider_error",
        error: body?.message ?? `Resend returned ${response.status}`,
      };
    }

    return { ok: true, providerId: body?.id };
  } catch (error) {
    return {
      ok: false,
      reason: "provider_error",
      error: error instanceof Error ? error.message : "Unknown email provider error",
    };
  }
}
