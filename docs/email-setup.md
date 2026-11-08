# Form notification email

`/list-your-business` already saves submissions in the Postgres `enquiries` table and sends an admin notification through Resend. The subject starts with `New WedHQ listing request`. The submitter's address is the Reply-To address. Failed or unconfigured delivery is recorded in `enquiries.email_status` and `email_error`; saving a form does not prove an email was delivered.

## Production setup

1. Sign in at https://resend.com and add `notifications.wedhq.co.uk` under Domains.
2. Add the exact DNS records Resend supplies at the domain's DNS provider. Do not replace existing website or incoming-mail records. Wait for Resend to show Verified.
3. Create a sending-only API key restricted to this sending domain. Keep it private.
4. In the Vercel project's Production environment variables, set:

   - `RESEND_API_KEY`: the private API key
   - `EMAIL_FROM`: `WedHQ <forms@notifications.wedhq.co.uk>`
   - `WEDHQ_ADMIN_EMAIL`: the owner's chosen notification inbox

5. Redeploy so the running site receives the new values.
6. Submit one clearly labelled test business request. Check its row has `email_status = 'sent'`, then check Resend delivery logs and the recipient inbox/spam folder. A provider acceptance is not proof of inbox arrival.

The same admin-recipient setting is also used by contact and SEO lead forms. Do not put the Resend key in a `VITE_` variable, browser code, or Git.
