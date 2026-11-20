'use client';

// Get verified: the checklist the API computes from the company's real data
// (GET /carrier/onboarding), document upload, the carrier agreement and submit.
// See carrier-platform/16-carrier-onboarding.md.
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, FileUp, Trash2 } from 'lucide-react';
import { del, post, supabase } from '@/lib/api';
import { useApi, useSession } from '@/lib/session';
import { day } from '@/lib/format';
import { Badge, Button, Card, ErrorNote, PageHeader, Spinner, useAction } from '@/components/ui';

type Step = { key: string; title: string; done: boolean; required: boolean; hint: string | null };
type Onb = {
  carrier: { status: string; name: string; review_note: string | null; submitted_at: string | null; contract_accepted_at: string | null };
  steps: Step[]; can_submit: boolean; missing: string[];
  docs: Record<string, { status: string; id: string } | null>;
  documents: Array<{ id: string; doc_type: string; status: string; file_name: string | null; review_note: string | null; created_at: string }>;
  contract: { version: string; url: string };
  doc_types: Record<string, { en: string; fr: string }>;
};

const WHERE: Record<string, string> = {
  profile: '/settings', payout: '/settings', hubs: '/setup', coverage: '/setup', rates: '/setup', policies: '/setup', riders: '/fleet', developers: '/developers',
};
const REQUIRED_DOCS = ['rccm', 'niu', 'transport_license', 'insurance', 'owner_id'];

export default function OnboardingPage() {
  const { me, can, reload } = useSession();
  const o = useApi<Onb>('/carrier/onboarding');
  const { busy, run } = useAction();
  const [uploading, setUploading] = useState<string | null>(null);
  const fileFor = useRef<string>('rccm');
  const input = useRef<HTMLInputElement>(null);

  if (o.loading && !o.data) return <Spinner />;
  if (!o.data) return <ErrorNote error={o.error} onRetry={o.reload} />;
  const d = o.data;
  const status = d.carrier.status;
  const manage = can('profile.manage');
  const owner = me?.active_carrier.role === 'owner';
  const required = d.steps.filter((s) => s.required);
  const pct = Math.round((required.filter((s) => s.done).length / Math.max(1, required.length)) * 100);

  const pick = (docType: string) => { fileFor.current = docType; input.current?.click(); };
  const upload = async (file: File) => {
    const docType = fileFor.current;
    const ext = (file.name.split('.').pop() || 'pdf').toLowerCase();
    if (!['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext)) return void run('x', async () => { throw new Error('PDF or photo (JPG, PNG, WEBP, HEIC) only'); });
    if (file.size > 10 * 1024 * 1024) return void run('x', async () => { throw new Error('Files up to 10 MB'); });
    setUploading(docType);
    await run('up', async () => {
      const u = await post<{ path: string; token: string }>('/carrier/onboarding/documents/upload-url', { doc_type: docType, ext });
      const { error } = await supabase().storage.from('chat-attachments').uploadToSignedUrl(u.path, u.token, file, { contentType: file.type || undefined });
      if (error) throw new Error(error.message);
      await post('/carrier/onboarding/documents', { doc_type: docType, storage_path: u.path, file_name: file.name.slice(0, 160) });
    }, 'Uploaded');
    setUploading(null);
    void o.reload();
  };

  return (
    <div>
      <PageHeader title="Get verified" subtitle={`${d.carrier.name} — finish these steps, then send your company to Mambanda for review.`} />

      {status === 'pending' && <Banner tone="blue">Submitted {d.carrier.submitted_at ? day(d.carrier.submitted_at) : ''}. Mambanda is checking your documents and setup — usually within 2 working days. You can keep improving your setup meanwhile.</Banner>}
      {status === 'rejected' && <Banner tone="red"><strong>Mambanda asked for changes:</strong> {d.carrier.review_note ?? '—'} Fix them below and submit again.</Banner>}
      {status === 'active' && <Banner tone="green">Your company is verified and receives jobs.</Banner>}

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-extrabold">Checklist</h2>
            <span className="text-sm text-mute">{pct}% of required steps</span>
          </div>
          <div className="h-2 rounded-full bg-p2 mb-5 overflow-hidden"><div className="h-full bg-lime" style={{ width: `${pct}%` }} /></div>
          <ul className="divide-y divide-line">
            {d.steps.map((s) => (
              <li key={s.key} className="py-3 flex items-start gap-3">
                {s.done ? <CheckCircle2 className="w-5 h-5 text-lime shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-mute shrink-0 mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{s.title} {!s.required && <span className="text-xs text-mute font-normal">· optional</span>}</p>
                  {s.hint && <p className="text-sm text-mute">{s.hint}</p>}
                </div>
                {!s.done && WHERE[s.key] && <Link href={WHERE[s.key]!} className="text-sm font-semibold text-lime hover:underline whitespace-nowrap">Open</Link>}
                {!s.done && s.key === 'documents' && <a href="#documents" className="text-sm font-semibold text-lime hover:underline">Upload</a>}
                {!s.done && s.key === 'contract' && <a href="#contract" className="text-sm font-semibold text-lime hover:underline">Read</a>}
              </li>
            ))}
          </ul>
          {['applied', 'rejected'].includes(status) && manage && (
            <div className="mt-5 flex items-center gap-3">
              <Button disabled={!d.can_submit} busy={busy === 'submit'}
                onClick={async () => { if (await run('submit', () => post('/carrier/onboarding/submit'), 'Sent to Mambanda for review')) { void o.reload(); void reload(); } }}>
                Submit for verification
              </Button>
              {!d.can_submit && <span className="text-sm text-mute">Complete the required steps first.</span>}
            </div>
          )}
        </Card>

        <div id="contract" className="h-fit"><Card className="space-y-3">
          <h2 className="font-extrabold">Carrier agreement</h2>
          <p className="text-sm text-mute">Covers cash-on-delivery custody and remittance (48 h), your liability for lost or damaged parcels, statements and payouts, and how you may use buyer data.</p>
          <a href={d.contract.url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-lime hover:underline">Read the agreement (version {d.contract.version})</a>
          {d.steps.find((s) => s.key === 'contract')?.done
            ? <p className="text-sm"><Badge tone="green">accepted</Badge> {d.carrier.contract_accepted_at ? day(d.carrier.contract_accepted_at) : ''}</p>
            : owner
              ? <Button className="w-full" busy={busy === 'contract'} onClick={async () => { if (await run('contract', () => post('/carrier/onboarding/contract', { version: d.contract.version, accept: true }), 'Agreement accepted')) void o.reload(); }}>I have read it and accept for {d.carrier.name}</Button>
              : <p className="text-sm text-mute">Only the owner can accept it.</p>}
        </Card></div>
      </div>

      <div id="documents" className="mt-6"><Card>
        <h2 className="font-extrabold mb-1">Legal documents</h2>
        <p className="text-sm text-mute mb-4">PDF or a clear photo, up to 10 MB. Only Mambanda&apos;s verification team sees them.</p>
        <input ref={input} type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void upload(f); }} />
        <div className="grid md:grid-cols-2 gap-3">
          {[...REQUIRED_DOCS, 'bank_or_momo_proof'].map((t) => {
            const files = d.documents.filter((x) => x.doc_type === t).sort((a, b) => b.created_at.localeCompare(a.created_at));
            const latest = files[0];
            return (
              <div key={t} className="rounded-xl border border-line p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{d.doc_types[t]?.en ?? t} {!REQUIRED_DOCS.includes(t) && <span className="text-xs text-mute font-normal">· optional</span>}</p>
                  {latest ? <Badge tone={latest.status === 'approved' ? 'green' : latest.status === 'rejected' ? 'red' : 'amber'}>{latest.status}</Badge> : <Badge tone="mute">missing</Badge>}
                </div>
                {latest && <p className="text-xs text-mute mt-1 truncate">{latest.file_name ?? 'file'} · {day(latest.created_at)}</p>}
                {latest?.status === 'rejected' && latest.review_note && <p className="text-xs text-rose-300 mt-1">{latest.review_note}</p>}
                {manage && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="ghost" busy={uploading === t} onClick={() => pick(t)}><FileUp className="w-4 h-4" />{latest ? 'Replace' : 'Upload'}</Button>
                    {latest && latest.status !== 'approved' && (
                      <Button size="sm" variant="ghost" onClick={async () => { if (await run('del', () => del(`/carrier/onboarding/documents/${latest.id}`), 'Removed')) void o.reload(); }}><Trash2 className="w-4 h-4" /></Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card></div>
    </div>
  );
}

function Banner({ tone, children }: { tone: 'blue' | 'red' | 'green'; children: React.ReactNode }) {
  const c = tone === 'red' ? 'border-rose-400/30 bg-rose-400/10 text-rose-100' : tone === 'green' ? 'border-lime/30 bg-lime/10 text-ink' : 'border-sky-400/30 bg-sky-400/10 text-sky-100';
  return <div className={`mb-6 rounded-2xl border text-sm px-4 py-3 ${c}`}>{children}</div>;
}
