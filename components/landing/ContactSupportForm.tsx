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
  'h-12 w-full rounded-xl border bg-white/[0.08] px-4 text-sm text-white placeholder:text-white/65 outline-none transition focus:ring-[3px] focus:ring-[#00a2e5]/70';
const inputOkClass = 'border-white/[0.18]';
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
  const [submitted, setSubmitted] = useState(false);

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
      setSubmitted(true);
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

      {submitted && <p role="status" className="mt-3 text-sm font-semibold text-[#a8ffe9]">Thanks, we&apos;ll get back to you soon.</p>}
      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="contact-name" className="sr-only">Your name</label>
          <input
            id="contact-name"
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
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name ? <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-red-200">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="sr-only">Your email address</label>
          <input
            id="contact-email" aria-label="Your email address"
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
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email ? <p id="contact-email-error" role="alert" className="mt-1.5 text-xs text-red-200">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className="sr-only">Your contact number</label>
          <input
            id="contact-phone" aria-label="Your contact number"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel-national"
            value={phone}
            maxLength={CONTACT_PHONE_LENGTH}
            onChange={(event) => {
              setPhone(sanitizePhoneInput(event.target.value));
              clearError('phone');
            }}
            placeholder={t('landing.contactSupport.phonePlaceholder')}
            className={inputClass(Boolean(errors.phone))}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : 'contact-phone-hint'}
          />
          {errors.phone ? (
            <p id="contact-phone-error" role="alert" className="mt-1.5 text-xs text-red-200">{errors.phone}</p>
          ) : (
            <p id="contact-phone-hint" className="mt-1.5 text-xs text-white/70">
              {t('landing.contactSupport.phoneHint', { count: CONTACT_PHONE_LENGTH })}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="sr-only">Type your query here</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value.slice(0, CONTACT_MESSAGE_MAX));
              clearError('message');
            }}
            maxLength={CONTACT_MESSAGE_MAX}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error contact-message-count' : 'contact-message-count'}
            placeholder={t('landing.contactSupport.messagePlaceholder')}
            className={`${inputClass(Boolean(errors.message))} h-[120px] min-h-[120px] resize-y py-3`}
          />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            {errors.message ? (
              <p id="contact-message-error" role="alert" className="text-xs text-red-200">{errors.message}</p>
            ) : (
              <span />
            )}
            <p id="contact-message-count" className={`shrink-0 text-xs ${messageCountClass}`}>
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
            className="inline-flex min-w-[120px] items-center justify-center rounded-xl bg-[#00e0b8] px-7 py-3.5 text-sm font-bold text-[#04122e] transition hover:bg-[#00c9a3] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? <><span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#010C39]/30 border-t-[#010C39]" aria-hidden="true" />{t('landing.contactSupport.submitting')}</> : t('landing.contactSupport.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
