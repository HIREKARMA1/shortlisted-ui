'use client';

import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import {
  CONTACT_MESSAGE_MAX,
  CONTACT_PHONE_LENGTH,
  ContactField,
  ContactFieldErrors,
  isValidEmail,
  isValidMessage,
  isValidName,
  isValidPhone,
  sanitizePhoneInput,
} from '@/lib/contact-form';

const inputBaseClass =
  'w-full rounded-lg border bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none transition focus:bg-black/30';
const inputOkClass = 'border-white/20 focus:border-white/40';
const inputErrorClass = 'border-red-400 focus:border-red-400';

type ApiValidationIssue = {
  loc?: (string | number)[];
  msg?: string;
};

function inputClass(hasError: boolean) {
  return `${inputBaseClass} ${hasError ? inputErrorClass : inputOkClass}`;
}

export function ContactSupportForm() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const messageLength = message.length;
  const messageCountClass =
    messageLength > CONTACT_MESSAGE_MAX * 0.9 ? 'text-amber-200' : 'text-white/60';

  const clearError = (field: ContactField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateForm = (): ContactFieldErrors => {
    const next: ContactFieldErrors = {};

    if (!isValidName(name)) {
      next.name = t('landing.contactSupport.errors.nameRequired');
    }
    if (!isValidEmail(email)) {
      next.email = t('landing.contactSupport.errors.emailInvalid');
    }
    if (!isValidPhone(phone)) {
      next.phone = t('landing.contactSupport.errors.phoneInvalid');
    }
    if (!isValidMessage(message)) {
      next.message = t('landing.contactSupport.errors.messageMin');
    }

    return next;
  };

  const parseApiErrors = (error: unknown): ContactFieldErrors => {
    const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
    if (!Array.isArray(detail)) return {};

    const next: ContactFieldErrors = {};
    for (const issue of detail as ApiValidationIssue[]) {
      const field = issue.loc?.[issue.loc.length - 1];
      if (field === 'name') next.name = t('landing.contactSupport.errors.nameRequired');
      if (field === 'email') next.email = t('landing.contactSupport.errors.emailInvalid');
      if (field === 'phone') next.phone = t('landing.contactSupport.errors.phoneInvalid');
      if (field === 'message') next.message = t('landing.contactSupport.errors.messageMin');
    }
    return next;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await api.submitContact({ name: name.trim(), email: email.trim(), phone, message: message.trim() });
      toast.success(t('landing.contactSupport.success'));
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error: unknown) {
      const apiErrors = parseApiErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
        return;
      }

      const msg =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('landing.contactSupport.error');
      toast.error(typeof msg === 'string' ? msg : t('landing.contactSupport.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
      <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
        {t('landing.contactSupport.title')}
      </h2>
      <p className="mt-2 text-sm text-white/80 sm:text-base">{t('landing.contactSupport.subtitle')}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
        <div>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError('name');
            }}
            placeholder={t('landing.contactSupport.namePlaceholder')}
            className={inputClass(Boolean(errors.name))}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="mt-1.5 text-xs text-red-300">{errors.name}</p> : null}
        </div>

        <div>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearError('email');
            }}
            placeholder={t('landing.contactSupport.emailPlaceholder')}
            className={inputClass(Boolean(errors.email))}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="mt-1.5 text-xs text-red-300">{errors.email}</p> : null}
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            maxLength={CONTACT_PHONE_LENGTH}
            onChange={(event) => {
              setPhone(sanitizePhoneInput(event.target.value));
              clearError('phone');
            }}
            placeholder={t('landing.contactSupport.phonePlaceholder')}
            className={inputClass(Boolean(errors.phone))}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? (
            <p className="mt-1.5 text-xs text-red-300">{errors.phone}</p>
          ) : (
            <p className="mt-1.5 text-xs text-white/50">
              {t('landing.contactSupport.phoneHint', { count: CONTACT_PHONE_LENGTH })}
            </p>
          )}
        </div>

        <div>
          <textarea
            name="message"
            rows={4}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value.slice(0, CONTACT_MESSAGE_MAX));
              clearError('message');
            }}
            maxLength={CONTACT_MESSAGE_MAX}
            placeholder={t('landing.contactSupport.messagePlaceholder')}
            className={`${inputClass(Boolean(errors.message))} min-h-[120px] resize-y`}
            aria-invalid={Boolean(errors.message)}
          />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            {errors.message ? (
              <p className="text-xs text-red-300">{errors.message}</p>
            ) : (
              <span />
            )}
            <p className={`shrink-0 text-xs ${messageCountClass}`}>
              {t('landing.contactSupport.messageCharCount', {
                count: messageLength,
                max: CONTACT_MESSAGE_MAX,
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-w-[120px] items-center justify-center rounded-lg bg-[#00DDB3] px-8 py-3 text-sm font-bold text-[#010C39] transition hover:bg-[#00c9a3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? t('landing.contactSupport.submitting') : t('landing.contactSupport.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
