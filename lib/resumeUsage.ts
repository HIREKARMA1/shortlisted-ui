export type ResumeUsage = {
  is_paid: boolean
  plan_label: string
  resumes_created: number
  resume_create_limit: number | null
  pdf_downloads: number
  pdf_download_limit: number | null
  can_create_resume: boolean
  can_download_pdf: boolean
  free_usage_completed: boolean
  unlimited: boolean
}

export type ResumeUpgradeReason =
  | 'usage_completed'
  | 'create_limit'
  | 'download_limit'

export function parseResumeUsageError(
  detail: unknown
): { code: string; message: string } | null {
  if (detail && typeof detail === 'object' && 'code' in detail) {
    const code = String((detail as { code?: unknown }).code || '')
    const message = String(
      (detail as { detail?: unknown }).detail ||
        (detail as { message?: unknown }).message ||
        ''
    )
    if (
      code === 'RESUME_CREATION_LIMIT_REACHED' ||
      code === 'RESUME_DOWNLOAD_LIMIT_REACHED'
    ) {
      return { code, message }
    }
  }
  if (typeof detail === 'string') {
    if (detail.startsWith('RESUME_CREATION_LIMIT_REACHED')) {
      return {
        code: 'RESUME_CREATION_LIMIT_REACHED',
        message: detail.split(':').slice(1).join(':').trim() || detail,
      }
    }
    if (detail.startsWith('RESUME_DOWNLOAD_LIMIT_REACHED')) {
      return {
        code: 'RESUME_DOWNLOAD_LIMIT_REACHED',
        message: detail.split(':').slice(1).join(':').trim() || detail,
      }
    }
  }
  return null
}

export function upgradeReasonFromErrorCode(code: string): ResumeUpgradeReason {
  if (code === 'RESUME_CREATION_LIMIT_REACHED') return 'create_limit'
  if (code === 'RESUME_DOWNLOAD_LIMIT_REACHED') return 'download_limit'
  return 'usage_completed'
}

export function newDownloadIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replace(/-/g, '')
  }
  return `dl_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
}
