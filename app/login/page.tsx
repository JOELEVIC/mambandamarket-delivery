'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/api';
import { Button, ErrorNote, Field, Input } from '@/components/ui';
import { AuthFrame, loginIdentifier } from '@/components/auth';
import { useSession } from '@/lib/session';

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status } = useSession();

  // Already signed in (or just did): go where we were headed.
  useEffect(() => {
    if (status !== 'ready' && status !== 'choose' && status !== 'no_carrier') return;
    const next = new URLSearchParams(window.location.search).get('next');
    router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : '/');
  }, [status, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase().auth.signInWithPassword({ email: loginIdentifier(id), password });
    setBusy(false);
    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Wrong email/phone or password.' : error.message);
      return;
    }
    // The session provider picks up SIGNED_IN, resolves the carrier, and the effect above navigates.
  };

  const reset = async () => {
    if (!id.includes('@')) { setError('Enter your email address first, then tap “Forgot password”. Riders: ask your dispatcher for a new invite.'); return; }
    await supabase().auth.resetPasswordForEmail(id.trim(), { redirectTo: `${window.location.origin}/login` });
    setError(null);
    alert('If that address has an account, a reset link is on its way.');
  };

  return (
    <AuthFrame title="Sign in" subtitle="For delivery companies, dispatchers and riders working with Mambanda Market.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email or phone"><Input autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} placeholder="you@company.cm or 677 12 34 56" required /></Field>
        <Field label="Password"><Input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        <ErrorNote error={error} />
        <Button type="submit" busy={busy} className="w-full">Sign in</Button>
      </form>
      <div className="flex justify-between text-sm mt-5">
        <button className="text-mute hover:text-ink" onClick={reset}>Forgot password</button>
        <Link href="/invite" className="text-lime font-semibold">I have an invite code</Link>
      </div>
    </AuthFrame>
  );
}
