export const xaf = (cents: number | null | undefined) =>
  `${Math.round(Number(cents ?? 0)).toLocaleString('fr-FR').replace(/ /g, ' ')} FCFA`;

export const when = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export const day = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export const STAGES: Record<string, { label: string; tone: 'lime' | 'blue' | 'amber' | 'red' | 'mute' | 'green' }> = {
  new: { label: 'New', tone: 'mute' },
  offered: { label: 'Offered', tone: 'amber' },
  carrier_accepted: { label: 'Accepted', tone: 'blue' },
  assigned: { label: 'Rider assigned', tone: 'blue' },
  picked_up: { label: 'Picked up', tone: 'lime' },
  at_hub: { label: 'At hub', tone: 'lime' },
  out_for_delivery: { label: 'Out for delivery', tone: 'lime' },
  delivered: { label: 'Delivered', tone: 'green' },
  delivery_failed: { label: 'Failed attempt', tone: 'red' },
  returning: { label: 'Returning', tone: 'amber' },
  returned: { label: 'Returned', tone: 'mute' },
  lost: { label: 'Lost', tone: 'red' },
  damaged: { label: 'Damaged', tone: 'red' },
  cancelled: { label: 'Cancelled', tone: 'mute' },
};

export const NEXT_STAGES: Record<string, string[]> = {
  carrier_accepted: ['picked_up'],
  assigned: ['picked_up'],
  picked_up: ['at_hub', 'out_for_delivery'],
  at_hub: ['out_for_delivery', 'returning'],
  delivery_failed: ['out_for_delivery', 'at_hub', 'returning'],
  returning: ['returned'],
  damaged: ['returning'],
};

export const ENTRY_LABEL: Record<string, string> = {
  cod_collected: 'Cash collected',
  delivery_fee: 'Your delivery fee',
  platform_fee: 'Mambanda fee',
  remittance: 'Remitted to Mambanda',
  payout: 'Paid to you',
  adjustment: 'Adjustment',
};

export const ROLE_LABEL: Record<string, string> = {
  owner: 'Owner', manager: 'Manager', dispatcher: 'Dispatcher', finance: 'Finance',
  hub_agent: 'Hub agent', rider: 'Rider', viewer: 'Viewer',
};
