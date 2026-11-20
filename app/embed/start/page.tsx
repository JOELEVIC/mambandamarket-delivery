'use client';

// Entry point of an embedded session (doc 14, tier C). The partner opened
// /embed/start#t=mke_… in a WebView or iframe. The nonce is in the fragment so
// it never reaches a server log; we trade it for a short embed token kept in
// this tab only, then show the requested screen without the portal chrome.
import React, { useEffect, useState } from 'react';
import { embedToken, post } from '@/lib/api';
import { ErrorNote, Spinner } from '@/components/ui';
import { useSession } from '@/lib/session';
import RiderJobs from '@/components/RiderJobs';
import EmbedCarrier from '@/components/EmbedCarrier';

type Session = { screen: string; params: Record<string, string>; carrier: { name: string }; allowed_origins: string[] };

function allowedHere(origins: string[]): boolean {
  if (window.top === window.self) return true; // a native WebView, not an iframe
  const ref = document.referrer ? new URL(document.referrer).origin : null;
  const anc = (window.location as unknown as { ancestorOrigins?: DOMStringList }).ancestorOrigins;
  const parent = anc && anc.length ? anc[0] : ref;
  return !!parent && origins.includes(parent);
}

export default function EmbedStart() {
  const [s, setS] = useState<Session | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const { reload } = useSession();

  useEffect(() => {
    const t = new URLSearchParams(window.location.hash.slice(1)).get('t');
    history.replaceState(null, '', window.location.pathname);
    const saved = sessionStorage.getItem('mk-embed-session');
    if (!t && saved && embedToken.get()) { setS(JSON.parse(saved)); void reload(); return; }
    if (!t) { setErr('This link is incomplete. Open it again from your app.'); return; }
    void post<Session & { access_token: string }>('/embed/exchange', { t }).then((r) => {
      if (!allowedHere(r.allowed_origins)) { setErr('This page cannot be shown inside this website.'); return; }
      embedToken.set(r.access_token);
      const sess = { screen: r.screen, params: r.params, carrier: r.carrier, allowed_origins: r.allowed_origins };
      sessionStorage.setItem('mk-embed-session', JSON.stringify(sess));
      setS(sess);
      void reload();
      window.parent?.postMessage({ type: 'mambanda.embed.ready', screen: r.screen }, '*');
    }).catch((e) => setErr(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <ErrorNote error={err} />
      {!s && !err && <Spinner />}
      {s?.screen === 'rider.jobs' && <RiderJobs />}
      {s?.screen === 'rider.job' && <RiderJobs only={s.params.job_id} />}
      {s?.screen.startsWith('carrier.') && <EmbedCarrier screen={s.screen} params={s.params} />}
      <p className="text-center text-[11px] text-mute mt-8">Powered by Mambanda Delivery · {s?.carrier.name}</p>
    </div>
  );
}
