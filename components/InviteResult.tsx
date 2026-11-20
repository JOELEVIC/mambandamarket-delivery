'use client';

import React from 'react';
import { Copy, MessageCircle } from 'lucide-react';
import { Button, toast } from './ui';

export type InviteRes = { code: string; link: string; app_link: string; share_text: string; whatsapp_url: string; invite: { role: string; name?: string | null } };

export default function InviteResult({ res, onDone }: { res: InviteRes; onDone: () => void }) {
  const copy = async (t: string) => { await navigator.clipboard.writeText(t).catch(() => undefined); toast('Copied'); };
  return (
    <div className="space-y-4">
      <p className="text-sm text-mute">Send this to {res.invite.name ?? 'them'}. The code works once, for 7 days.</p>
      <div className="rounded-2xl bg-p2 border border-lime/40 p-5 text-center">
        <p className="text-xs uppercase tracking-wider text-mute">Invite code</p>
        <p className="text-3xl font-extrabold tracking-[0.2em] text-lime mt-1 select-all">{res.code}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <a href={res.whatsapp_url} target="_blank" rel="noreferrer" className="mambanda-btn text-sm px-5 py-2.5"><MessageCircle className="w-4 h-4" />Send on WhatsApp</a>
        <Button variant="ghost" onClick={() => copy(res.share_text)}><Copy className="w-4 h-4" />Copy message</Button>
        <Button variant="ghost" onClick={() => copy(res.link)}>Copy link</Button>
      </div>
      <Button variant="ghost" className="w-full" onClick={onDone}>Done</Button>
    </div>
  );
}
