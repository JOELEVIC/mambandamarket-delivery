// The portal's only door to Mambanda: the Core API, with the caller's session.
//
// Two kinds of bearer token:
//   * a Supabase session (normal sign-in) — refreshed by supabase-js;
//   * an embed token (mko_…) held in sessionStorage while the portal runs
//     inside a partner's app (see app/embed).
// X-Carrier-Id is sent when the person belongs to several carriers and picked one.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.mambandamarket.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://vnmmqujmeoamuksgdoqd.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_ImOqFcjPQ4I7uwlf5UHeOA_ykbjOkgz';

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'mk-delivery-auth' },
    });
  }
  return client;
}

const EMBED_KEY = 'mk-embed-token';
const CARRIER_KEY = 'mk-carrier-id';

function store(kind: 'local' | 'session') {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}
export const embedToken = {
  get: () => store('session')?.getItem(EMBED_KEY) ?? null,
  set: (t: string | null) => (t ? store('session')?.setItem(EMBED_KEY, t) : store('session')?.removeItem(EMBED_KEY)),
};
export const activeCarrier = {
  get: () => store('local')?.getItem(CARRIER_KEY) ?? null,
  set: (id: string | null) => (id ? store('local')?.setItem(CARRIER_KEY, id) : store('local')?.removeItem(CARRIER_KEY)),
};

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

async function token(): Promise<string | null> {
  const e = embedToken.get();
  if (e) return e;
  const { data } = await supabase().auth.getSession();
  return data.session?.access_token ?? null;
}

export async function api<T = any>(path: string, init: { method?: string; body?: unknown; carrier?: string | null; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (init.auth !== false) {
    const t = await token();
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const carrier = init.carrier === undefined ? activeCarrier.get() : init.carrier;
  if (carrier) headers['X-Carrier-Id'] = carrier;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: init.method ?? (init.body !== undefined ? 'POST' : 'GET'),
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'network', 'No connection to Mambanda. Check your internet and try again.');
  }
  const text = await res.text();
  let json: any = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    /* not json */
  }
  if (!res.ok) {
    const e = json?.error ?? {};
    throw new ApiError(res.status, e.code ?? 'http_error', e.message ?? `Request failed (${res.status})`, e.details);
  }
  return json as T;
}

export const get = <T = any>(p: string) => api<T>(p);
export const post = <T = any>(p: string, body: unknown = {}) => api<T>(p, { method: 'POST', body });
export const patch = <T = any>(p: string, body: unknown) => api<T>(p, { method: 'PATCH', body });
export const del = <T = any>(p: string) => api<T>(p, { method: 'DELETE' });
