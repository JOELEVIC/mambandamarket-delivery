'use client';

// Who is signed in, which carrier they are acting for, and what they may do.
// Every page below the shell reads this; nothing here is mock data.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { activeCarrier, ApiError, embedToken, get, supabase } from './api';

export type Me = {
  user: { id: string; email: string | null };
  active_carrier: { carrier_id: string; name: string; role: string; is_house: boolean; status: string; permissions: string[] };
  memberships: Array<{ carrier_id: string; role: string; name: string; logo_url?: string | null; status?: string }>;
  rider_of: string[];
  via: 'session' | 'oauth' | 'embed';
};

type Choice = { carrier_id: string; name: string; role: string };

type Ctx = {
  status: 'loading' | 'signed_out' | 'no_carrier' | 'choose' | 'ready';
  me: Me | null;
  choices: Choice[];
  error: string | null;
  can: (perm: string) => boolean;
  switchCarrier: (id: string) => void;
  reload: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionCtx = createContext<Ctx | null>(null);

export const PUBLIC_PREFIXES = ['/login', '/invite', '/oauth', '/embed', '/forgot'];

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<Ctx['status']>('loading');
  const [me, setMe] = useState<Me | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const load = useCallback(async (retried = false): Promise<void> => {
    setError(null);
    // Never sit in "signed_out" while a fresh session is being checked: that
    // state redirects to /login, and the user who just signed in would bounce.
    setStatus((s) => (s === 'ready' ? s : 'loading'));
    const { data } = await supabase().auth.getSession();
    if (!data.session && !embedToken.get()) {
      setStatus('signed_out');
      setMe(null);
      return;
    }
    try {
      const m = await get<Me>('/carrier/me');
      setMe(m);
      setStatus('ready');
      activeCarrier.set(m.active_carrier.carrier_id);
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401) {
        setStatus('signed_out');
      } else if (err.code === 'carrier_selection_required') {
        setChoices(((err.details as { memberships?: Choice[] })?.memberships ?? []) as Choice[]);
        setStatus('choose');
      } else if (err.status === 403) {
        // A stale X-Carrier-Id (removed from that company) falls back to choosing again.
        if (activeCarrier.get() && !retried) {
          activeCarrier.set(null);
          const again = await get<Me>('/carrier/me').catch(() => null);
          if (again) {
            setMe(again);
            setStatus('ready');
            activeCarrier.set(again.active_carrier.carrier_id);
            return;
          }
        }
        setStatus('no_carrier');
      } else {
        setError(err.message);
        setStatus('ready');
      }
    }
  }, []);

  useEffect(() => {
    void load();
    const { data } = supabase().auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') void load();
    });
    return () => data.subscription.unsubscribe();
  }, [load]);

  useEffect(() => {
    if (status === 'signed_out' && !isPublic) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [status, isPublic, pathname, router]);

  const value = useMemo<Ctx>(() => ({
    status,
    me,
    choices,
    error,
    can: (perm) => !!me?.active_carrier.permissions.includes(perm),
    switchCarrier: (id) => {
      activeCarrier.set(id);
      setStatus('loading');
      void load();
    },
    reload: () => load(),
    signOut: async () => {
      activeCarrier.set(null);
      embedToken.set(null);
      await supabase().auth.signOut();
      setMe(null);
      setStatus('signed_out');
      router.replace('/login');
    },
  }), [status, me, choices, error, load, router]);

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession(): Ctx {
  const c = useContext(SessionCtx);
  if (!c) throw new Error('useSession outside SessionProvider');
  return c;
}

/** Fetch-on-mount with reload; re-runs when the active carrier changes. */
export function useApi<T = any>(path: string | null) {
  const { me } = useSession();
  const carrierId = me?.active_carrier.carrier_id;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(!!path);
  const reload = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    try {
      setData(await get<T>(path));
      setError(null);
    } catch (e) {
      setError(e as ApiError);
    } finally {
      setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    void reload();
  }, [reload, carrierId]);
  return { data, error, loading, reload, setData };
}
