import { createAuthClient } from "@neondatabase/auth";
import { SupabaseAuthAdapter } from "@neondatabase/auth/vanilla/adapters";

const neonAuthUrl =
  import.meta.env.VITE_NEON_AUTH_URL ??
  import.meta.env.NEON_AUTH_BASE_URL ??
  import.meta.env.VITE_AUTH_URL ??
  "";

export const isNeonAuthConfigured = Boolean(neonAuthUrl);

export const neonAuth = isNeonAuthConfigured
  ? createAuthClient(neonAuthUrl, {
      adapter: SupabaseAuthAdapter(),
    })
  : null;
