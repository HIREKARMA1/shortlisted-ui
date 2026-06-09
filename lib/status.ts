export type BadgeTone = 'primary' | 'sky' | 'success' | 'warning' | 'error' | 'neutral';

export function applicationBadgeTone(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (s.includes('select') || s.includes('offer')) return 'success';
  if (s.includes('reject')) return 'error';
  if (s.includes('shortlist') || s.includes('interview')) return 'sky';
  if (s.includes('applied') || s.includes('pending')) return 'primary';
  return 'neutral';
}

export function accessBadgeTone(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (s === 'active') return 'success';
  if (s === 'locked') return 'warning';
  if (s === 'revoked') return 'error';
  return 'neutral';
}
