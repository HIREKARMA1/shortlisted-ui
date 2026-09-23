'use client'

import {
  ArrowRight,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from 'lucide-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

const OFFICE_ADDRESS =
  '2nd Floor, SS Niwas, Hirekarma Private Limited, Raghunathpur, Bhubaneswar, Odisha 751024'

const MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=2nd+Floor%2C+SS+Niwas%2C+Hirekarma+Private+Limited%2C+Raghunathpur%2C+Bhubaneswar%2C+Odisha+751024'

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3739.9763807315003!2d85.8203458793457!3d20.383863700000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19096e0259fc7f%3A0x7ad66a4df8112eda!2sHireKarma%20Private%20Limited!5e0!3m2!1sen!2sin!4v1789020372578!5m2!1sen!2sin'

const WHATSAPP_QR_IMAGE =
  'https://disha-ui.s3.ap-south-1.amazonaws.com/new-disha/My_QR_Code_1-1024.jpeg'

const SUPPORT_PHONE = '+1 (555) 450-3532'

const WHATSAPP_STEPS = [
  'Send "Hi" on WhatsApp.',
  'Select or describe your issue.',
  'Submit your query through the chatbot.',
  'Our support team will connect with you soon to resolve your issue.',
] as const

const cardBtn =
  'inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function buildWhatsAppUrl(number: string, message: string): string | null {
  const normalized = number.replace(/\D/g, '')
  if (!normalized) return null
  const params = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${normalized}${params}`
}

export type ContactSupportContentProps = {
  variant?: 'public' | 'dashboard'
  className?: string
}

export function ContactSupportContent({
  variant = 'public',
  className,
}: ContactSupportContentProps) {
  const phoneDisplay = SUPPORT_PHONE
  const whatsappHref = buildWhatsAppUrl(phoneDisplay, 'Hi')
  const email = config.contact.email || 'info@hirekarma.in'

  return (
    <div
      className={cn(
        'w-full',
        variant === 'public' ? 'space-y-8 sm:space-y-10' : 'space-y-6 sm:space-y-8',
        className
      )}
    >
      <section className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-3.5 py-1.5 text-xs font-semibold text-secondary-700 dark:border-secondary-800 dark:bg-secondary-900/40 dark:text-secondary-300">
          <Headphones className="h-3.5 w-3.5" />
          We&apos;re Here to Help
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-4xl">
          Get in Touch with Our Support Team
        </h1>
        <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">
          Have questions about your Premium access, account, or anything else? Our support team is
          always here to help you.
        </p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-5 shadow-sm dark:border-emerald-900/40 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/30 sm:p-6 lg:p-7">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-6">
          <div className="lg:col-span-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md shadow-emerald-500/25 ring-4 ring-white dark:ring-emerald-900/50">
              <WhatsAppIcon className="h-8 w-8" />
            </div>
            <span className="mt-4 inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Fast &amp; Easy Support
            </span>
            <h2 className="mt-3 text-xl font-bold text-slate-800 dark:text-white">
              WhatsApp Support
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Send &apos;Hi&apos; to our WhatsApp support chatbot and raise your query. Our support
              team will connect with you soon.
            </p>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-base font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
              >
                <Phone className="h-4 w-4" />
                {phoneDisplay}
              </a>
            )}
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1ebe57] hover:shadow-md sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-emerald-200/80 lg:pl-6 dark:lg:border-emerald-800/50">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">How it works</h3>
            <ol className="mt-4 space-y-3.5">
              {WHATSAPP_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-emerald-200/80 bg-white/70 p-4 text-center shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/30 sm:p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white sm:text-base">
                Scan to Chat on WhatsApp
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                Open WhatsApp on your phone and scan the QR code to start a chat.
              </p>
              <div className="mx-auto mt-4 flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-2 dark:border-gray-700">
                <img
                  src={WHATSAPP_QR_IMAGE}
                  alt="WhatsApp QR code for HireKarma support"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                <Smartphone className="h-3.5 w-3.5" />
                Or save this number: {phoneDisplay}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch">
        <article className="flex min-h-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-500 text-white">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">Email Us</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            For any queries, you can also reach us via email.
          </p>
          <p className="mt-3 text-sm font-semibold text-secondary-700 dark:text-secondary-300">
            {email}
          </p>
          <div className="mt-auto pt-6">
            <a
              href={`mailto:${email}`}
              className={cn(
                cardBtn,
                'border-secondary-500 bg-secondary-50 text-secondary-700 hover:bg-secondary-100 dark:border-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-300 dark:hover:bg-secondary-900/70'
              )}
            >
              Send Email
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </article>

        <article className="flex min-h-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500 text-white">
            <MapPin className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">Our Office</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {OFFICE_ADDRESS}
          </p>
          <div className="mt-auto pt-6">
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                cardBtn,
                'border-violet-500 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-600 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/70'
              )}
            >
              Get Directions
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </article>

        <article className="flex min-h-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:col-span-2 sm:p-6 lg:col-span-1">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Visit Our Office
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {OFFICE_ADDRESS}
              </p>
            </div>
          </div>

          <div className="relative mt-4 min-h-[160px] flex-1 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
            <iframe
              title="HireKarma Private Limited location"
              src={MAPS_EMBED_URL}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="mt-4">
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                cardBtn,
                'border-primary-500 bg-primary-50 text-primary-700 hover:bg-primary-100 dark:border-primary-600 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-900/70'
              )}
            >
              Open in Maps
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </article>
      </section>
    </div>
  )
}
