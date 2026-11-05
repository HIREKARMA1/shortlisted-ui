'use client'

import { Crown, Sparkles } from 'lucide-react'
import type { ResumeUsage } from '@/lib/resumeUsage'

type ResumeUsageIndicatorProps = {
  usage: ResumeUsage | null
  loading?: boolean
}

export function ResumeUsageIndicator({ usage, loading }: ResumeUsageIndicatorProps) {
  if (loading && !usage) {
    return (
      <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-xs text-gray-500">
        Loading plan…
      </div>
    )
  }

  if (!usage) return null

  if (usage.is_paid || usage.unlimited) {
    return (
      <div className="inline-flex max-w-full flex-col gap-0.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-left">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
          <Crown className="h-3.5 w-3.5" aria-hidden="true" />
          Premium Access
        </span>
        <span className="text-xs text-emerald-700">
          Unlimited Resume Creation · Unlimited Downloads
        </span>
      </div>
    )
  }

  const createdLimit = usage.resume_create_limit ?? 1
  const downloadLimit = usage.pdf_download_limit ?? 1

  return (
    <div className="inline-flex max-w-full flex-col gap-1 rounded-lg border border-orange-200 bg-[#fff3e8] px-3 py-2 text-left">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-orange">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Free Plan
      </span>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-ink-secondary">
        <span>
          Resume Created:{' '}
          <strong className="font-semibold text-ink-primary">
            {usage.resumes_created} / {createdLimit}
          </strong>
        </span>
        <span>
          PDF Downloaded:{' '}
          <strong className="font-semibold text-ink-primary">
            {usage.pdf_downloads} / {downloadLimit}
          </strong>
        </span>
      </div>
    </div>
  )
}
