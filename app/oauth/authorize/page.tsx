'use client';

// "Sign in with Mambanda" consent screen for partner apps (doc 14, tier B).
// The partner opens this page with the standard OAuth 2.1 query (PKCE S256
// required). The person signs in with their Mambanda account if needed, sees
// which company's app is asking and for what, and approves. Only people who
// already belong to that company can approve; the API enforces it.
import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { get, post, supabase } from '@/lib/api';
import { AuthFrame, loginIdentifier } from '@/components/auth';
import { Button, ErrorNote, Field, Input, Spinner } from '@/components/ui';

const SCOPE_TEXT: Record<string, string> = {
  'rider.jobs': 'See and update the deliveries assigned to you',
  'rider.location': 'Share your location and availability while you work',
  'rider.cod': 'See the cash you hold and declare hand-overs',
  'carrier.read': 'Read your company’s jobs, fleet and money on Mambanda',
  'carrier.write': 'Act in the portal on your behalf, within your role',
};

export default function Authorize() {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params);
    const cid = params.get('client_id');
    if (!cid) { setErr('This link is missing client_id.'); return; }
    if (params.get('code_challenge_method') !== 'S256' || !params.get('code_challenge')) { setErr('This app must use PKCE (S256).'); return; }
    void get(`/oauth/clients/${encodeURIComponent(cid)}`).then(setClient).catch((e) => setErr(e.message));
    void supabase().auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
  }, []);

  const scopes = (q?.get('scope') ?? '').split(/[\s,]+/).filter(Boolean);
  const shown = scopes.length ? scopes : (client?.scopes ?? []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { data, error } = await supabase().auth.signInWithPassword({ email: loginIdentifier(id), password: pw });
    setBusy(false);
    if (error) setErr('Wrong email/phone or password.');
    else setEmail(data.user?.email ?? null);
  };

  const respond = async (allow: boolean) => {
    const redirect = q!.get('redirect_uri') ?? '';
    const state = q!.get('state');
    if (!allow) {
      if (!client?.redirect_uris?.includes(redirect)) { setErr('Cancelled.'); return; }
      const u = new URL(redirect);
      u.searchParams.set('error', 'access_denied');
      if (state) u.searchParams.set('state', state);
      window.location.href = u.toString();
      return;
    }
    setBusy(true); setErr(null);
    try {
      const r = await post<{ redirect_to: string }>('/oauth/authorize', {
        client_id: q!.get('client_id'), redirect_uri: redirect, response_type: 'code', scope: q!.get('scope') ?? '',
        state: state ?? undefined, code_challenge: q!.get('code_challenge'), code_challenge_method: 'S256',
      });
      window.location.href = r.redirect_to;
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  if (!client && !err) return <AuthFrame title="Sign in with Mambanda"><Spinner /></AuthFrame>;
  return (
    <AuthFrame title={client ? `${client.name} wants to use your Mambanda account` : 'Sign in with Mambanda'} subtitle={client ? `An app by ${client.carrier.name}.` : undefined}>
      <ErrorNote error={err} />
      {client && !email && (
        <form onSubmit={signIn} className="space-y-4 mt-4">
          <Field label="Email or phone"><Input value={id} onChange={(e) => setId(e.target.value)} required autoComplete="username" /></Field>
          <Field label="Password"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required autoComplete="current-password" /></Field>
          <Button type="submit" busy={busy} className="w-full">Sign in</Button>
        </form>
      )}
      {client && email && (
        <div className="space-y-5 mt-4">
          <p className="text-sm text-mute">Signed in as <b className="text-ink">{email}</b>. It will be able to:</p>
          <ul className="space-y-2">{shown.map((s: string) => <li key={s} className="flex gap-2 text-sm"><ShieldCheck className="w-4 h-4 text-lime shrink-0 mt-0.5" />{SCOPE_TEXT[s] ?? s}</li>)}</ul>
          <p className="text-xs text-mute">It cannot see your purchases, messages or anything outside {client.carrier.name}. You can withdraw access by asking your company to disable the app.</p>
          <div className="flex gap-2"><Button busy={busy} className="flex-1" onClick={() => respond(true)}>Allow</Button><Button variant="ghost" onClick={() => respond(false)}>Cancel</Button></div>
        </div>
      )}
    </AuthFrame>
  );
}
