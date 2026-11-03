'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export type EditablePayment = {
  student_id: string;
  payment_id?: string | null;
  student_name: string;
  student_email: string;
  amount_paise?: number | null;
  paid_at?: string | null;
  utr?: string | null;
  collected_by?: string | null;
  note?: string | null;
  receipt_url?: string | null;
};

function toDatetimeLocalValue(value?: string | null): string {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EditPaymentModal({
  payment,
  onClose,
  onSaved,
}: {
  payment: EditablePayment;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const isCreate = !payment.payment_id;
  const [amount, setAmount] = useState(
    payment.amount_paise != null ? String(Number(payment.amount_paise) / 100) : '',
  );
  const [paidAt, setPaidAt] = useState(toDatetimeLocalValue(payment.paid_at));
  const [utr, setUtr] = useState(payment.utr || '');
  const [collectedBy, setCollectedBy] = useState(payment.collected_by || '');
  const [note, setNote] = useState(payment.note || '');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isCreate || payment.amount_paise != null) return;
    api
      .getPaymentConfig()
      .then((config) => {
        if (config.amount_inr) setAmount(String(config.amount_inr));
      })
      .catch(() => undefined);
  }, [isCreate, payment.amount_paise]);

  const submit = async () => {
    if (!payment.student_id) {
      toast.error(t('common.errors.generic'));
      return;
    }
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error(t('dashboard.superAdminLeads.invalidAmount'));
      return;
    }
    if (!paidAt) {
      toast.error(t('dashboard.superAdminLeads.invalidPaidAt'));
      return;
    }

    const form = new FormData();
    form.append('amount_inr', String(amountNum));
    form.append('paid_at', new Date(paidAt).toISOString());
    if (utr.trim()) form.append('utr', utr.trim());
    if (collectedBy.trim()) form.append('collected_by', collectedBy.trim());
    if (note.trim()) form.append('note', note.trim());
    if (receipt) form.append('receipt', receipt);

    setSaving(true);
    try {
      if (isCreate) {
        form.append('student_id', payment.student_id);
        await api.recordOfflinePayment(form);
        toast.success(t('dashboard.superAdminStudents.paymentCreated'));
      } else {
        await api.updateOfflinePayment(String(payment.payment_id), form);
        toast.success(t('dashboard.superAdminStudents.paymentUpdated'));
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-elevated">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink-primary">
              {isCreate
                ? t('dashboard.superAdminStudents.addPaymentTitle')
                : t('dashboard.superAdminStudents.editPaymentTitle')}
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              {payment.student_name} · {payment.student_email}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-surface-muted">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label={t('dashboard.superAdminLeads.amountInr')}
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label={t('dashboard.superAdminLeads.paidAt')}
            type="datetime-local"
            value={paidAt}
            onChange={(e) => setPaidAt(e.target.value)}
          />
          <Input
            label={t('dashboard.superAdminLeads.utr')}
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder={t('dashboard.superAdminLeads.utrPlaceholder')}
          />
          <Input
            label={t('dashboard.superAdminLeads.collectedBy')}
            value={collectedBy}
            onChange={(e) => setCollectedBy(e.target.value)}
            placeholder={t('dashboard.superAdminLeads.collectedByPlaceholder')}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-primary">
              {t('dashboard.superAdminLeads.receipt')}
            </label>
            {payment.receipt_url ? (
              <a
                href={payment.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-2 inline-block text-xs link-brand"
              >
                {t('dashboard.superAdminStudents.viewReceipt')}
              </a>
            ) : null}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-primary"
            />
          </div>
          <Input
            label={t('dashboard.superAdminLeads.note')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.actions.cancel')}
          </Button>
          <Button variant="accent" onClick={submit} disabled={saving}>
            {saving
              ? t('dashboard.superAdminStudents.savingPayment')
              : isCreate
                ? t('dashboard.superAdminStudents.savePaymentCreate')
                : t('dashboard.superAdminStudents.savePayment')}
          </Button>
        </div>
      </div>
    </div>
  );
}
