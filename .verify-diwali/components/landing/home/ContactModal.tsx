'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { contactEmail } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { Modal } from './primitives';
import { useShell } from './ShellContext';

export function ContactModal() {
  const { contactOpen, setContactOpen } = useShell();
  const { siteInfo } = useHome();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const email = siteInfo?.contact_email || contactEmail;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (form.phone.trim().length < 10 || form.message.trim().length < 10) {
      toast.error('Add a 10-digit phone and a short message.');
      return;
    }
    setSending(true);
    try {
      await api.submitContact(form);
      toast.success('Message sent.');
      setForm({ name: '', email: '', phone: '', message: '' });
      setContactOpen(false);
    } catch {
      toast.error('Could not send right now. Try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={contactOpen} title="Contact us" onClose={() => setContactOpen(false)}>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Or email <a className="font-semibold text-[var(--brand-sky)]" href={`mailto:${email}`}>{email}</a>
      </p>
      <form onSubmit={onSubmit} className="mt-4 grid gap-2">
        <input required aria-label="Name" placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11 rounded-xl border border-[var(--border)] px-3 text-sm" />
        <input required type="email" aria-label="Email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-11 rounded-xl border border-[var(--border)] px-3 text-sm" />
        <input required aria-label="Phone" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="h-11 rounded-xl border border-[var(--border)] px-3 text-sm" />
        <textarea required aria-label="Message" placeholder="Message" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="min-h-24 rounded-xl border border-[var(--border)] px-3 py-2 text-sm" />
        <button type="submit" disabled={sending} className="mt-1 rounded-full bg-[var(--brand-orange)] py-2.5 text-sm font-semibold text-white disabled:opacity-70">
          {sending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </Modal>
  );
}
