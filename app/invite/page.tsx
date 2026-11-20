'use client';

// Claim an invite. A carrier sends a rider or a staff member a code (or a link
// carrying it); the person sets a password here — or signs in first if they
// already have a Mambanda account — and is bound to that carrier immediately.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { get, post, supabase } from '@/lib/api';
import { ROLE_LABEL } from '@/lib/format';
import { AuthFrame } from '@/components/auth';
import { Button, ErrorNote, Field, Input } from '@/components/ui';

type Preview = { carrier: { name: string; logo_url?: string | null }; role: string; name: string | null; email: string | null; phone_hint: string | null; login: string | null; expires_at: string };

export default function InvitePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [signedIn, setSignedIn] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ carrier: string; role: string; login: string | null } | null>(null);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('code');
    if (c) { setCode(c); void look(c); }
    void supabase().auth.getSession().then(({ data }) => setSignedIn(data.session?.user.email ?? null));
  }, []);

  async function look(c = code) {
    setError(null);
    setBusy(true);
    try {
      const p = await get<Preview>(`/invites/${encodeURIComponent(c.trim())}`);
      setPreview(p);
      setName(p.name ?? '');
      setEmail(p.email ?? '');
    } catch (e) {
      setPreview(null);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const body: Record<string, string> = { code: code.trim() };
      if (!signedIn) {
        body.password = password;
        if (name) body.display_name = name;
        if (email && !preview?.email) body.email = email;
      }
      const res = await post<{ carrier: { name: string }; role: string; login: string | null }>('/invites/claim', body);
      if (!signedIn && res.login) await supabase().auth.signInWithPassword({ email: res.login, password });
      setDone({ carrier: res.carrier.name, role: res.role, login: res.login });
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    const rider = done.role === 'rider';
    return (
      <AuthFrame title={`Welcome to ${done.carrier}`} subtitle={rider ? 'Your account is ready. Open the Mambanda Delivery app and sign in to see your deliveries.' : 'Your account is ready.'}>
        {rider && done.login?.startsWith('rider.') && (
          <p className="text-sm text-mute mb-4">In the app, sign in with <b className="text-ink">your phone number</b> and the password you just chose.</p>
        )}
        <Button className="w-full" onClick={() => router.replace(rider ? '/ride' : '/')}>{rider ? 'Open my deliveries on the web' : 'Open the portal'}</Button>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame title="Join a delivery company" subtitle="Enter the code your company sent you.">
      {!preview ? (
        <form onSubmit={(e) => { e.preventDefault(); void look(); }} className="space-y-4">
          <Field label="Invite code"><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="K7PX-M2QR" autoCapitalize="characters" required /></Field>
          <ErrorNote error={error} />
          <Button type="submit" busy={busy} className="w-full">Continue</Button>
        </form>
      ) : (
        <form onSubmit={claim} className="space-y-4">
          <div className="rounded-2xl bg-p2 border border-line p-4">
            <p className="text-sm text-mute">You are invited to</p>
            <p className="text-lg font-extrabold">{preview.carrier.name}</p>
            <p className="text-sm">as <b className="text-lime">{ROLE_LABEL[preview.role] ?? preview.role}</b>{preview.name ? ` · ${preview.name}` : ''}</p>
          </div>
          {signedIn ? (
            <p className="text-sm text-mute">You are signed in as <b className="text-ink">{signedIn}</b>. The invite will be added to this account.</p>
          ) : (
            <>
              <Field label="Your name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
              {preview.login !== 'phone' && (
                <Field label="Email" hint={preview.email ? 'Set by your company' : undefined}><Input type="email" value={email} disabled={!!preview.email} onChange={(e) => setEmail(e.target.value)} required /></Field>
              )}
              {preview.login === 'phone' && <p className="text-sm text-mute">You will sign in with your phone number ({preview.phone_hint}) and this password.</p>}
              <Field label="Choose a password" hint="At least 8 characters."><Input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" /></Field>
            </>
          )}
          <ErrorNote error={error} />
          {error?.includes('already uses this address') && <Link href={`/login?next=${encodeURIComponent(`/invite?code=${code}`)}`} className="text-sm text-lime font-semibold block">Sign in, then come back here</Link>}
          <Button type="submit" busy={busy} className="w-full">Accept invite</Button>
        </form>
      )}
    </AuthFrame>
  );
}
