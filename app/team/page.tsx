'use client';

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { del, patch, post } from '@/lib/api';
import { useApi, useSession } from '@/lib/session';
import { ROLE_LABEL, day } from '@/lib/format';
import { Badge, Button, Card, ErrorNote, Field, Input, Modal, PageHeader, Select, Spinner, Table, useAction } from '@/components/ui';
import InviteResult, { type InviteRes } from '@/components/InviteResult';

const STAFF_ROLES = ['owner', 'manager', 'dispatcher', 'finance', 'hub_agent', 'viewer'];
const ROLE_HELP: Record<string, string> = {
  owner: 'Everything, including payout details and other owners',
  manager: 'Runs the company day to day; cannot add owners or managers',
  dispatcher: 'Accepts jobs, assigns riders, manages the fleet',
  finance: 'Remittances and statements',
  hub_agent: 'Scans parcels in and out, takes cash from riders',
  viewer: 'Sees everything, changes nothing',
};

export default function TeamPage() {
  const { me, can } = useSession();
  const members = useApi<{ items: any[] }>('/carrier/members');
  const invites = useApi<{ items: any[] }>('/carrier/invites');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ role: 'dispatcher', name: '', email: '', phone: '' });
  const [res, setRes] = useState<InviteRes | null>(null);
  const { busy, run } = useAction();
  const manage = can('team.manage');
  const myRole = me?.active_carrier.role;
  const assignable = STAFF_ROLES.filter((r) => myRole === 'owner' || !['owner', 'manager'].includes(r));

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await run('inv', () => post<InviteRes>('/carrier/invites', { role: form.role, name: form.name || undefined, email: form.email || undefined, phone: form.phone || undefined }));
    if (r) { setOpen(false); setRes(r); void invites.reload(); }
  };

  const staff = (members.data?.items ?? []).filter((m) => m.role !== 'rider');
  const pending = (invites.data?.items ?? []).filter((i) => i.role !== 'rider' && !i.claimed_at && !i.revoked_at && new Date(i.expires_at) > new Date());

  return (
    <div>
      <PageHeader title="Team" subtitle="The people who run your company on Mambanda. Riders are managed under Fleet."
        actions={manage && <Button onClick={() => setOpen(true)}><UserPlus className="w-4 h-4" />Invite</Button>} />
      <Card>
        <ErrorNote error={members.error} onRetry={members.reload} />
        {members.loading && !members.data ? <Spinner /> : (
          <Table head={['Person', 'Role', 'Status', 'Since', '']}>
            {staff.map((m) => (
              <tr key={m.id}>
                <td className="py-3 pr-4"><p className="font-bold">{m.profile?.display_name ?? m.email ?? 'Member'}</p><p className="text-xs text-mute">{m.email}</p></td>
                <td className="py-3 pr-4">
                  {manage && m.user_id !== me?.user.id && (myRole === 'owner' || !['owner', 'manager'].includes(m.role)) ? (
                    <Select value={m.role} onChange={(e) => run('role', () => patch(`/carrier/members/${m.id}`, { role: e.target.value }), 'Role changed').then(() => members.reload())} className="py-1.5">
                      {assignable.concat(assignable.includes(m.role) ? [] : [m.role]).map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                    </Select>
                  ) : <Badge tone="lime">{ROLE_LABEL[m.role] ?? m.role}</Badge>}
                </td>
                <td className="py-3 pr-4"><Badge tone={m.status === 'active' ? 'green' : 'mute'}>{m.status}</Badge></td>
                <td className="py-3 pr-4 text-mute">{day(m.created_at)}</td>
                <td className="py-3 pr-4 text-right">
                  {manage && m.status === 'active' && m.user_id !== me?.user.id && (myRole === 'owner' || !['owner', 'manager'].includes(m.role)) &&
                    <Button size="sm" variant="danger" busy={busy === m.id} onClick={() => run(m.id, () => del(`/carrier/members/${m.id}`), 'Access removed').then(() => members.reload())}>Remove</Button>}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {pending.length > 0 && (
        <Card className="mt-6">
          <h2 className="font-extrabold mb-3">Pending invites</h2>
          <ul className="divide-y divide-line text-sm">{pending.map((i) => (
            <li key={i.id} className="py-2 flex flex-wrap gap-2 justify-between"><span>{i.name ?? i.email ?? i.phone} · {ROLE_LABEL[i.role]}</span>
              <span className="text-mute">expires {day(i.expires_at)}</span>
              {manage && <button className="text-rose-300 text-xs" onClick={() => run('rev', () => del(`/carrier/invites/${i.id}`), 'Revoked').then(() => invites.reload())}>Revoke</button>}</li>
          ))}</ul>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Invite a team member">
        <form onSubmit={send} className="space-y-4">
          <Field label="Role" hint={ROLE_HELP[form.role]}><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{assignable.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</Select></Field>
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email" hint="They will sign in with it."><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
          <Field label="WhatsApp number (optional)"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Button type="submit" busy={busy === 'inv'} className="w-full">Create invite</Button>
        </form>
      </Modal>
      <Modal open={!!res} onClose={() => setRes(null)} title="Invite ready">{res && <InviteResult res={res} onDone={() => setRes(null)} />}</Modal>
    </div>
  );
}
