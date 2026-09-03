import { useEffect, useState } from "react";
import { neonAuth } from "@/integrations/neon/auth-client";

type AuthUser = {
  id: string;
  email?: string;
  name?: string | null;
};

type AuthSession = {
  user: AuthUser;
};

/** Client-side Neon auth state. Safe during SSR (returns loading/no user). */
export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (!neonAuth) {
      setSession(null);
      setLoading(false);
      return;
    }

    const { data: sub } = neonAuth.onAuthStateChange((_event, next) => {
      if (!active) return;
      setSession(next as AuthSession | null);
      setLoading(false);
    });

    neonAuth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession((data.session as AuthSession | null) ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setSession(null);
        setLoading(false);
      });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const user: AuthUser | null = session?.user ?? null;
  return { session, user, loading };
}
