'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ArrowLeft, ExternalLink, FileText, ImageIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getLoginPathForRole } from '@/lib/auth/login-routes'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoadingState } from '@/components/ui/LoadingState'
import { supportQueryService } from '@/services/supportQueryService'
import { SupportQuery } from '@/types/supportQuery'
import type { DashboardRole } from '@/lib/dashboard-nav'

function isLikelyImage(url: string) {
  const lower = url.toLowerCase()
  return (
    lower.includes('.png') ||
    lower.includes('.jpg') ||
    lower.includes('.jpeg') ||
    lower.includes('.webp') ||
    lower.includes('.gif') ||
    lower.includes('image')
  )
}

export function SupportAttachmentsView({
  role,
}: {
  role: Extract<DashboardRole, 'admin' | 'super_admin'>
}) {
  const router = useRouter()
  const params = useParams()
  const { logout } = useAuth()
  const basePath = role === 'super_admin' ? '/dashboard/super-admin/support' : '/dashboard/admin/support'

  const queryNumber = useMemo(() => {
    const raw = params?.queryNumber
    const value = Array.isArray(raw) ? raw[0] : raw
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }, [params])

  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState<SupportQuery | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const userType = localStorage.getItem('user_type')
    const allowed =
      role === 'super_admin'
        ? userType === 'super_admin'
        : userType === 'admin' || userType === 'super_admin'
    if (!localStorage.getItem('access_token') || !allowed) {
      router.replace(getLoginPathForRole(role))
      return
    }
    setReady(true)
  }, [router, role])

  const load = useCallback(async () => {
    if (queryNumber == null) {
      setError('Invalid query number.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const row = await supportQueryService.get(queryNumber)
      setQuery(row)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to load attachments.'
      setError(String(message))
      setQuery(null)
      toast.error(String(message))
    } finally {
      setIsLoading(false)
    }
  }, [queryNumber])

  useEffect(() => {
    if (!ready) return
    load()
  }, [ready, load])

  if (!ready) return <LoadingState />

  const screenshotUrl = query?.payment_screenshot_url?.trim() || ''
  const resumeUrl = query?.resume_url?.trim() || ''

  return (
    <DashboardLayout
      role={role}
      title={queryNumber != null ? `Attachments · #${queryNumber}` : 'Attachments'}
      subtitle="Payment screenshot and resume for this WhatsApp enrollment"
      onLogout={logout}
    >
      <div className="mb-4">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Verify Payment
        </Link>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
          <p className="mb-3 text-red-700">{error}</p>
          <button
            type="button"
            onClick={load}
            className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      ) : query ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Applicant</dt>
                <dd className="font-medium text-slate-900">{query.applicant_name || '—'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-medium text-slate-900">{query.user_phone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Problem</dt>
                <dd className="font-medium text-slate-900">{query.problem}</dd>
              </div>
            </dl>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Payment screenshot</h2>
            </div>
            {screenshotUrl ? (
              <div className="space-y-3">
                {isLikelyImage(screenshotUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={screenshotUrl}
                    alt="Payment screenshot"
                    className="max-h-[70vh] max-w-full rounded-lg border border-slate-200 object-contain"
                  />
                ) : (
                  <p className="text-sm text-slate-600">Open the file in a new tab to review.</p>
                )}
                <a
                  href={screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue"
                >
                  Open original
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No payment screenshot uploaded.</p>
            )}
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />
              <h2 className="text-base font-semibold text-slate-900">Resume</h2>
            </div>
            {resumeUrl ? (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue"
              >
                Open / download resume
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <p className="text-sm text-slate-500">No resume uploaded.</p>
            )}
          </section>
        </div>
      ) : null}
    </DashboardLayout>
  )
}
