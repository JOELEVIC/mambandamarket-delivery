'use client';

// For carriers with their own software. Three ways in (doc 14):
//   A. API key + webhooks — your server talks to ours;
//   B. "Sign in with Mambanda" — your app signs your riders/staff in with
//      their Mambanda account and acts as them (OAuth 2.1 + PKCE);
//   C. Embedded screens — open our job screens inside your app.
import React, { useState } from 'react';
import { Copy, KeyRound, Plus, Webhook, AppWindow } from 'lucide-react';
import { API_URL, del, get, patch, post } from '@/lib/api';
import { useApi } from '@/lib/session';
import { day, when } from '@/lib/format';
import { Badge, Button, Card, Empty, Field, Input, Modal, PageHeader, Select, Spinner, Table, Tabs, toast, useAction } from '@/components/ui';

type Tab = 'keys' | 'webhooks' | 'apps' | 'guide';
const copy = async (t: string) => { await navigator.clipboard.writeText(t).catch(() => undefined); toast('Copied'); };

function Secret({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-amber-300">{note}</p>
      <Field label={label}><div className="flex gap-2"><Input readOnly value={value} className="font-mono text-xs" /><Button type="button" variant="ghost" onClick={() => copy(value)}><Copy className="w-4 h-4" /></Button></div></Field>
    </div>
  );
}

function Keys() {
  const keys = useApi<{ items: any[]; available_scopes: string[] }>('/carrier/api-keys');
  const [f, setF] = useState<{ name: string; env: string; scopes: string[] } | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const { busy, run } = useAction();
  return (
    <>
      <Button className="mb-4" onClick={() => setF({ name: '', env: 'test', scopes: ['jobs.read', 'jobs.write', 'riders.write'] })}><Plus className="w-4 h-4" />New key</Button>
      <Card>
        {keys.loading && !keys.data ? <Spinner /> : (keys.data?.items.length ?? 0) === 0 ? <Empty title="No API keys">Start with a test key: it only sees sandbox jobs.</Empty> : (
          <Table head={['Name', 'Key', 'Mode', 'Scopes', 'Last used', '']}>
            {keys.data!.items.map((k) => (
              <tr key={k.id} className={k.revoked_at ? 'opacity-50' : ''}>
                <td className="py-2.5 pr-4 font-bold">{k.name}</td><td className="py-2.5 pr-4 font-mono text-xs">{k.prefix}…</td>
                <td className="py-2.5 pr-4"><Badge tone={k.env === 'live' ? 'lime' : 'blue'}>{k.env}</Badge></td>
                <td className="py-2.5 pr-4 text-xs text-mute">{(k.scopes ?? []).join(' ')}</td>
                <td className="py-2.5 pr-4 text-mute">{when(k.last_used_at)}</td>
                <td className="py-2.5 text-right">{!k.revoked_at && <Button size="sm" variant="danger" busy={busy === k.id} onClick={() => run(k.id, () => del(`/carrier/api-keys/${k.id}`), 'Revoked').then(() => keys.reload())}>Revoke</Button>}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <Modal open={!!f || !!secret} onClose={() => { setF(null); setSecret(null); }} title={secret ? 'Your new key' : 'New API key'}>
        {secret ? <Secret label="Secret key" value={secret} note="Copy it now — we only store a fingerprint and cannot show it again." /> : f && (
          <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); const r = await run('k', () => post<{ secret_key: string }>('/carrier/api-keys', f)); if (r) { setF(null); setSecret(r.secret_key); void keys.reload(); } }}>
            <Field label="Name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Dispatch server" required /></Field>
            <Field label="Mode" hint="Live keys are issued once Mambanda has verified your company."><Select value={f.env} onChange={(e) => setF({ ...f, env: e.target.value })}><option value="test">Test (sandbox)</option><option value="live">Live</option></Select></Field>
            <div className="grid grid-cols-2 gap-2">{(keys.data?.available_scopes ?? []).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.scopes.includes(s)} onChange={(e) => setF({ ...f, scopes: e.target.checked ? [...f.scopes, s] : f.scopes.filter((x) => x !== s) })} /><code>{s}</code></label>
            ))}</div>
            <Button type="submit" busy={busy === 'k'} className="w-full">Create key</Button>
          </form>
        )}
      </Modal>
    </>
  );
}

function Hooks() {
  const hooks = useApi<{ items: any[]; available_events: string[] }>('/carrier/webhooks');
  const [f, setF] = useState<{ url: string; env: string; events: string[] } | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [log, setLog] = useState<{ hook: any; items: any[] } | null>(null);
  const { busy, run } = useAction();
  return (
    <>
      <Button className="mb-4" onClick={() => setF({ url: 'https://', env: 'test', events: ['offer.created', 'shipment.updated'] })}><Plus className="w-4 h-4" />Add endpoint</Button>
      <Card>
        {(hooks.data?.items.length ?? 0) === 0 ? <Empty title="No webhooks">We POST signed events to your HTTPS endpoint and retry for 15 hours.</Empty> : (
          <Table head={['Endpoint', 'Mode', 'Events', 'Health', '']}>
            {hooks.data!.items.map((h) => (
              <tr key={h.id}>
                <td className="py-2.5 pr-4 font-mono text-xs break-all">{h.url}</td>
                <td className="py-2.5 pr-4"><Badge tone={h.env === 'live' ? 'lime' : 'blue'}>{h.env}</Badge></td>
                <td className="py-2.5 pr-4 text-xs text-mute">{(h.events ?? []).join(', ')}</td>
                <td className="py-2.5 pr-4">{!h.is_active ? <Badge>off</Badge> : h.failure_count > 0 ? <Badge tone="red">{h.failure_count} failing</Badge> : <Badge tone="green">ok</Badge>}</td>
                <td className="py-2.5 text-right whitespace-nowrap space-x-1">
                  <Button size="sm" variant="ghost" busy={busy === `t${h.id}`} onClick={() => run(`t${h.id}`, () => post(`/carrier/webhooks/${h.id}/test`), 'Ping queued')}>Test</Button>
                  <Button size="sm" variant="ghost" onClick={async () => setLog({ hook: h, items: (await get<{ items: any[] }>(`/carrier/webhooks/${h.id}/deliveries`)).items })}>Log</Button>
                  <Button size="sm" variant="ghost" onClick={() => run('tg', () => patch(`/carrier/webhooks/${h.id}`, { is_active: !h.is_active }), h.is_active ? 'Paused' : 'Resumed').then(() => hooks.reload())}>{h.is_active ? 'Pause' : 'Resume'}</Button>
                  <Button size="sm" variant="danger" onClick={() => run('d', () => del(`/carrier/webhooks/${h.id}`), 'Deleted').then(() => hooks.reload())}>Delete</Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <Modal open={!!f || !!secret} onClose={() => { setF(null); setSecret(null); }} title={secret ? 'Signing secret' : 'Add webhook endpoint'}>
        {secret ? <Secret label="Signing secret" value={secret} note="Verify X-Mambanda-Signature (t=…,v1=HMAC-SHA256 of “t.body”) with this. Shown once." /> : f && (
          <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); const r = await run('w', () => post<{ signing_secret: string }>('/carrier/webhooks', f)); if (r) { setF(null); setSecret(r.signing_secret); void hooks.reload(); } }}>
            <Field label="HTTPS URL"><Input type="url" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} required /></Field>
            <Field label="Mode"><Select value={f.env} onChange={(e) => setF({ ...f, env: e.target.value })}><option value="test">Test events</option><option value="live">Live events</option></Select></Field>
            <div className="grid grid-cols-2 gap-2">{(hooks.data?.available_events ?? []).map((ev) => (
              <label key={ev} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.events.includes(ev)} onChange={(e) => setF({ ...f, events: e.target.checked ? [...f.events, ev] : f.events.filter((x) => x !== ev) })} /><code className="text-xs">{ev}</code></label>
            ))}</div>
            <Button type="submit" busy={busy === 'w'} className="w-full">Add endpoint</Button>
          </form>
        )}
      </Modal>
      <Modal open={!!log} onClose={() => setLog(null)} title="Deliveries" wide>
        {log && (log.items.length === 0 ? <Empty title="Nothing sent yet" /> : (
          <Table head={['Event', 'When', 'Attempts', 'Result', '']}>
            {log.items.map((d) => (
              <tr key={d.id}>
                <td className="py-2 pr-4"><code className="text-xs">{d.event}</code></td><td className="py-2 pr-4 text-mute">{when(d.created_at)}</td><td className="py-2 pr-4">{d.attempts}</td>
                <td className="py-2 pr-4">{d.delivered_at ? <Badge tone="green">{d.last_status}</Badge> : d.dead_at ? <Badge tone="red">gave up</Badge> : <Badge tone="amber">{d.last_error ?? 'queued'}</Badge>}</td>
                <td className="py-2 text-right">{(d.dead_at || d.delivered_at) && <Button size="sm" variant="ghost" onClick={() => run('rp', () => post(`/carrier/webhooks/deliveries/${d.id}/replay`), 'Re-queued')}>Replay</Button>}</td>
              </tr>
            ))}
          </Table>
        ))}
      </Modal>
    </>
  );
}

function Apps() {
  const apps = useApi<{ items: any[]; available_scopes: string[] }>('/carrier/oauth-clients');
  const [f, setF] = useState<{ name: string; redirect: string; origins: string; scopes: string[]; confidential: boolean } | null>(null);
  const [made, setMade] = useState<any | null>(null);
  const { busy, run } = useAction();
  return (
    <>
      <Button className="mb-4" onClick={() => setF({ name: '', redirect: '', origins: '', scopes: ['rider.jobs', 'rider.location', 'rider.cod'], confidential: false })}><Plus className="w-4 h-4" />Register an app</Button>
      <Card>
        {(apps.data?.items.length ?? 0) === 0 ? <Empty title="No apps">Register your rider app so your riders can “Sign in with Mambanda” inside it.</Empty> : (
          <Table head={['App', 'Client ID', 'Scopes', 'Redirects', 'Since', '']}>
            {apps.data!.items.map((a) => (
              <tr key={a.id} className={a.is_active ? '' : 'opacity-50'}>
                <td className="py-2.5 pr-4 font-bold">{a.name} {a.confidential && <Badge>server</Badge>}</td>
                <td className="py-2.5 pr-4 font-mono text-xs"><button onClick={() => copy(a.client_id)}>{a.client_id}</button></td>
                <td className="py-2.5 pr-4 text-xs text-mute">{(a.scopes ?? []).join(' ')}</td>
                <td className="py-2.5 pr-4 text-xs text-mute break-all">{(a.redirect_uris ?? []).join(', ')}</td>
                <td className="py-2.5 pr-4 text-mute">{day(a.created_at)}</td>
                <td className="py-2.5 text-right"><Button size="sm" variant={a.is_active ? 'danger' : 'ghost'} onClick={() => run('a', () => patch(`/carrier/oauth-clients/${a.id}`, { is_active: !a.is_active }), a.is_active ? 'Disabled; its sessions are signed out' : 'Enabled').then(() => apps.reload())}>{a.is_active ? 'Disable' : 'Enable'}</Button></td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
      <Modal open={!!f || !!made} onClose={() => { setF(null); setMade(null); }} title={made ? 'App registered' : 'Register an app'}>
        {made ? (
          <div className="space-y-3">
            <Field label="Client ID"><Input readOnly value={made.item.client_id} className="font-mono text-xs" /></Field>
            {made.client_secret && <Secret label="Client secret" value={made.client_secret} note="Server apps only. Shown once." />}
            <p className="text-sm text-mute">Authorize URL: <code>{made.authorize_url}</code><br />Token URL: <code>{made.token_url}</code></p>
          </div>
        ) : f && (
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            const r = await run('o', () => post('/carrier/oauth-clients', { name: f.name, scopes: f.scopes, confidential: f.confidential,
              redirect_uris: f.redirect.split(/[\s,]+/).filter(Boolean), allowed_origins: f.origins.split(/[\s,]+/).filter(Boolean) }));
            if (r) { setF(null); setMade(r); void apps.reload(); }
          }}>
            <Field label="App name" hint="Shown to your riders on the consent screen"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></Field>
            <Field label="Redirect URIs" hint="https://… or your app scheme, e.g. com.olatrans.rider:/oauth"><Input value={f.redirect} onChange={(e) => setF({ ...f, redirect: e.target.value })} /></Field>
            <Field label="Websites allowed to embed our screens (optional)" hint="https://dispatch.olatrans.cm"><Input value={f.origins} onChange={(e) => setF({ ...f, origins: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-2">{(apps.data?.available_scopes ?? []).map((s) => (
              <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.scopes.includes(s)} onChange={(e) => setF({ ...f, scopes: e.target.checked ? [...f.scopes, s] : f.scopes.filter((x) => x !== s) })} /><code>{s}</code></label>
            ))}</div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.confidential} onChange={(e) => setF({ ...f, confidential: e.target.checked })} />Server-side app (gets a client secret)</label>
            <Button type="submit" busy={busy === 'o'} className="w-full">Register</Button>
          </form>
        )}
      </Modal>
    </>
  );
}

function Guide() {
  const portal = typeof window !== 'undefined' ? window.location.origin : '';
  const block = 'block bg-p2 border border-line rounded-xl p-4 text-xs font-mono overflow-x-auto whitespace-pre';
  return (
    <div className="space-y-6">
      <Card><h3 className="font-extrabold flex items-center gap-2 mb-2"><KeyRound className="w-4 h-4 text-lime" />A · Your server ↔ our API</h3>
        <p className="text-sm text-mute mb-3">Accept jobs, assign your own riders, post events and deliver with the buyer’s code. Start with a test key and the sandbox.</p>
        <code className={block}>{`curl -X POST ${API_URL}/partner/v1/test/jobs -H "X-Api-Key: mk_test_…"
curl ${API_URL}/partner/v1/jobs?status=offered -H "X-Api-Key: mk_test_…"
curl -X POST ${API_URL}/partner/v1/jobs/<id>/accept -H "X-Api-Key: mk_test_…" -H "Idempotency-Key: 7c1…"
curl -X POST ${API_URL}/partner/v1/jobs/<id>/assign -H "X-Api-Key: mk_test_…" -H "Content-Type: application/json" \\
  -d '{"rider":{"external_ref":"R-17","name":"Ali","phone":"677000000"}}'
curl -X POST ${API_URL}/partner/v1/jobs/<id>/events -d '{"stage":"picked_up"}' …
curl -X POST ${API_URL}/partner/v1/jobs/<id>/deliver -d '{"code":"123456"}' …`}</code>
      </Card>
      <Card><h3 className="font-extrabold flex items-center gap-2 mb-2"><AppWindow className="w-4 h-4 text-lime" />B · “Sign in with Mambanda” in your app</h3>
        <p className="text-sm text-mute mb-3">Your rider signs in with the Mambanda account their invite created. Your app then calls <code>/rider/*</code> as that rider — cash limits, GPS and the delivery code keep working.</p>
        <code className={block}>{`GET  ${portal}/oauth/authorize?client_id=mkc_…&redirect_uri=com.you.app:/oauth
     &response_type=code&scope=rider.jobs%20rider.location%20rider.cod
     &code_challenge=<S256>&code_challenge_method=S256&state=…
POST ${API_URL}/oauth/token  grant_type=authorization_code&code=…&code_verifier=…&client_id=…&redirect_uri=…
GET  ${API_URL}/rider/jobs   Authorization: Bearer mko_…
POST ${API_URL}/oauth/token  grant_type=refresh_token&refresh_token=mkr_…&client_id=…`}</code>
      </Card>
      <Card><h3 className="font-extrabold flex items-center gap-2 mb-2"><Webhook className="w-4 h-4 text-lime" />C · Our screens inside your app</h3>
        <p className="text-sm text-mute mb-3">Ask for a one-time link (valid 60 s) and open it in a WebView or an iframe on an allowed website.</p>
        <code className={block}>{`POST ${API_URL}/partner/v1/embed-sessions   (X-Api-Key with the "embed" scope)
{ "user": { "rider_external_ref": "R-17" }, "screen": "rider.jobs" }
→ { "url": "${portal}/embed/start#t=mke_…", "expires_in": 60 }
Screens: rider.jobs, rider.job, carrier.inbox, carrier.job, carrier.finance`}</code>
        <p className="text-sm text-mute mt-3">Full reference: <a className="text-lime" href={`${API_URL}/docs`} target="_blank" rel="noreferrer">{API_URL}/docs</a></p>
      </Card>
    </div>
  );
}

export default function DevelopersPage() {
  const [tab, setTab] = useState<Tab>('guide');
  return (
    <div>
      <PageHeader title="Developers" subtitle="Connect your own dispatch software, rider app or website to Mambanda." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'guide', label: 'How it works' }, { id: 'keys', label: 'API keys' }, { id: 'webhooks', label: 'Webhooks' }, { id: 'apps', label: 'Apps (sign-in)' }]} />
      {tab === 'guide' && <Guide />}{tab === 'keys' && <Keys />}{tab === 'webhooks' && <Hooks />}{tab === 'apps' && <Apps />}
    </div>
  );
}
