'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { ArrowRight, Check, Lock } from 'lucide-react'
import type { ResumeUpgradeReason } from '@/lib/resumeUsage'

type ResumeUpgradeModalProps = {
  open: boolean
  reason: ResumeUpgradeReason
  onClose: () => void
}

const COPY: Record<
  ResumeUpgradeReason,
  { title: string; body: string; dismiss: string }
> = {
  usage_completed: {
    title: 'Unlock Unlimited Resume Building',
    body: "You've used your free resume creation and download. Upgrade your account to create unlimited professional resumes and download them anytime.",
    dismiss: 'Maybe Later',
  },
  create_limit: {
    title: 'Resume Creation Limit Reached',
    body: 'You have already used your free resume creation. Upgrade to create unlimited resumes.',
    dismiss: 'Cancel',
  },
  download_limit: {
    title: 'Resume Download Limit Reached',
    body: 'Your free resume download has been used. Upgrade to download resumes without limits.',
    dismiss: 'Cancel',
  },
}

const BENEFITS = [
  'Unlimited resume creation',
  'Unlimited resume downloads',
  'Access to all available resume templates',
  'Edit and manage multiple resumes',
  'Save and update resumes anytime',
]

function focusable(root: HTMLElement | null) {
  if (!root) return []
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((node) => !node.hasAttribute('disabled'))
}

export function ResumeUpgradeModal({ open, reason, onClose }: ResumeUpgradeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const root = dialogRef.current
    const nodes = focusable(root)
    ;(nodes[0] ?? root)?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusable(dialogRef.current)
      if (!items.length) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open) return null

  const copy = COPY[reason]

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-upgrade-title"
        tabIndex={-1}
        className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-elevated outline-none sm:p-8"
      >
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3e8] text-brand-orange">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
            Upgrade Required
          </p>
          <h2
            id="resume-upgrade-title"
            className="mt-2 font-display text-xl font-bold tracking-tight text-ink-primary"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{copy.body}</p>
        </div>

        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          What you unlock
        </p>
        <ul className="mt-3 space-y-2">
          {BENEFITS.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-ink-secondary">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e8f6ef] text-brand-green">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/subscribe"
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-orange px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
          >
            Upgrade Now
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-secondary transition hover:text-ink-primary"
          >
            {copy.dismiss}
          </button>
        </div>
      </div>
    </div>
  )
}
