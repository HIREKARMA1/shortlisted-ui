'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Headphones, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getLoginPathForRole } from '@/lib/auth/login-routes'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LoadingState } from '@/components/ui/LoadingState'
import { supportQueryService } from '@/services/supportQueryService'
import {
  SupportEnquiryType,
  SupportPaymentDecision,
  SupportQuery,
  SupportQueryKpis,
  SupportQueryStatus,
} from '@/types/supportQuery'
import type { DashboardRole } from '@/lib/dashboard-nav'

const STATUS_STYLES: Record<string, string> = {
  not_resolved: 'bg-brand-yellow/20 text-ink',
  connected: 'bg-brand-sky/15 text-brand-blue',
  resolved: 'bg-brand-green/15 text-brand-green',
}

const STATUS_OPTIONS: { value: SupportQueryStatus; label: string }[] = [
  { value: 'not_resolved', label: 'Not resolved' },
  { value: 'connected', label: 'Connected' },
  { value: 'resolved', label: 'Resolved' },
]

const PAYMENT_ACTIONABLE = new Set(['awaiting_verification', 'awaiting_offline'])
const EMPTY_KPIS: SupportQueryKpis = { total: 0, not_resolved: 0, connected: 0, resolved: 0 }
const PAGE_SIZE = 20

function enquiryLabel(value?: string | null) {
  if (value === 'disha') return 'Disha'
  if (value === 'shortlisted') return 'Shortlisted'
  if (value === 'batch_enroll') return 'Batch enroll'
  return value || '—'
}

function paymentLabel(value?: string | null) {
  if (!value || value === 'none') return '—'
  return value.replaceAll('_', ' ')
}

function statusLabel(status: string) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status
}

function snippet(problem: string, max = 80) {
  const compact = (problem || '').replace(/\s+/g, ' ').trim()
  if (compact.length <= max) return compact
  return `${compact.slice(0, max - 1)}…`
}

function formatDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function normalizeEnquiryType(value?: string | null) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function normalizePaymentStatus(value?: string | null) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

export function SupportVerifyView({ role }: { role: Extract<DashboardRole, 'admin' | 'super_admin'> }) {
  const router = useRouter()
  const { logout } = useAuth()
  const basePath = role === 'super_admin' ? '/dashboard/super-admin/support' : '/dashboard/admin/support'

  const [ready, setReady] = useState(false)
  const [queries, setQueries] = useState<SupportQuery[]>([])
  const [kpis, setKpis] = useState<SupportQueryKpis>(EMPTY_KPIS)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [enquiryFilter, setEnquiryFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [updatingQueryNumber, setUpdatingQueryNumber] = useState<number | null>(null)

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

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => window.clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, enquiryFilter])

  const listParams = useCallback(() => {
    return {
      status: statusFilter === 'all' ? ('' as const) : (statusFilter as SupportQueryStatus),
      enquiry_type:
        enquiryFilter === 'all' ? ('' as const) : (enquiryFilter as SupportEnquiryType),
      q: debouncedSearch,
    }
  }, [statusFilter, enquiryFilter, debouncedSearch])

  const fetchQueries = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await supportQueryService.list({
        ...listParams(),
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })
      setQueries(response.queries || [])
      setTotal(response.total || 0)
      setKpis(response.kpis || EMPTY_KPIS)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to load support queries.'
      setError(String(message))
      setQueries([])
      toast.error(String(message))
    } finally {
      setIsLoading(false)
    }
  }, [listParams, page])

  useEffect(() => {
    if (!ready) return
    fetchQueries()
  }, [ready, fetchQueries])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleStatusChange = async (queryNumber: number, next: SupportQueryStatus) => {
    setUpdatingQueryNumber(queryNumber)
    try {
      await supportQueryService.updateStatus(queryNumber, next)
      toast.success(`Query #${queryNumber} updated`)
      await fetchQueries()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to update status.'
      toast.error(String(message))
    } finally {
      setUpdatingQueryNumber(null)
    }
  }

  const handlePaymentDecision = async (
    queryNumber: number,
    decision: SupportPaymentDecision
  ) => {
    setUpdatingQueryNumber(queryNumber)
    try {
      await supportQueryService.updatePayment(queryNumber, decision)
      toast.success(`Query #${queryNumber} payment ${decision}`)
      await fetchQueries()
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to update payment.'
      toast.error(String(message))
    } finally {
      setUpdatingQueryNumber(null)
    }
  }

  const kpiCards = useMemo(
    () => [
      { label: 'Total', value: kpis.total, filter: 'all' },
      { label: 'Not resolved', value: kpis.not_resolved, filter: 'not_resolved' },
      { label: 'Connected', value: kpis.connected, filter: 'connected' },
      { label: 'Resolved', value: kpis.resolved, filter: 'resolved' },
    ],
    [kpis]
  )

  if (!ready) return <LoadingState />

  return (
    <DashboardLayout
      role={role}
      title="Verify Payment"
      subtitle="WhatsApp enrollments and support queries from Disha"
      onLogout={logout}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpiCards.map((card) => (
            <button
              key={card.label}
              type="button"
              onClick={() => setStatusFilter(card.filter)}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-brand-blue"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search phone, name, problem…"
            className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm"
          />
          <select
            value={enquiryFilter}
            onChange={(e) => setEnquiryFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          >
            <option value="all">All enquiries</option>
            <option value="disha">Disha</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="batch_enroll">Batch enroll</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <p className="mb-3 text-red-700">{error}</p>
            <button
              type="button"
              onClick={fetchQueries}
              className="rounded-lg bg-brand-blue px-4 py-2 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        ) : queries.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <Headphones className="mx-auto mb-3 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">No queries found</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {[
                      'Query No',
                      'Enquiry',
                      'Name',
                      'Phone',
                      'Problem',
                      'Status',
                      'Payment',
                      'Attachment',
                      'Created',
                      'Action',
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {queries.map((row) => {
                    const busy = updatingQueryNumber === row.query_number
                    const enquiryType = normalizeEnquiryType(row.enquiry_type)
                    const paymentStatus = normalizePaymentStatus(row.payment_status)
                    const isBatchEnroll =
                      enquiryType === 'batch_enroll' ||
                      normalizeEnquiryType(row.problem).includes('batch_enroll')
                    const paymentAwaitingAction = PAYMENT_ACTIONABLE.has(paymentStatus)
                    // Same rule as Disha Support: Batch enroll + awaiting payment → Approve/Reject
                    const showPaymentActions = isBatchEnroll && paymentAwaitingAction
                    const showStatusDropdown = !isBatchEnroll
                    const hasAttachment =
                      isBatchEnroll && Boolean(row.payment_screenshot_url || row.resume_url)
                    return (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-slate-900">
                          #{row.query_number}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                          {enquiryLabel(enquiryType || row.enquiry_type)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                          {row.applicant_name || '—'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {row.user_phone}
                          </span>
                        </td>
                        <td className="max-w-md px-4 py-3 text-sm text-slate-700">
                          {snippet(row.problem)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              STATUS_STYLES[row.status] || STATUS_STYLES.not_resolved
                            }`}
                          >
                            {statusLabel(row.status)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-slate-600">
                          {paymentLabel(row.payment_status)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          {hasAttachment ? (
                            <Link
                              href={`${basePath}/${row.query_number}/attachments`}
                              className="inline-flex h-8 items-center rounded-md bg-brand-blue px-3 text-xs font-medium text-white hover:opacity-90"
                            >
                              View
                            </Link>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex min-w-[160px] flex-col gap-2">
                            {showStatusDropdown && (
                              <select
                                value={row.status}
                                disabled={busy}
                                onChange={(e) => {
                                  const next = e.target.value as SupportQueryStatus
                                  if (next !== row.status) handleStatusChange(row.query_number, next)
                                }}
                                className="h-9 min-w-[140px] rounded-lg border border-slate-200 bg-white px-2 text-sm disabled:opacity-60"
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            {showPaymentActions && (
                              <>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handlePaymentDecision(row.query_number, 'approved')}
                                  className="h-9 whitespace-nowrap rounded-md bg-brand-green px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
                                >
                                  Approve payment
                                </button>
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => handlePaymentDecision(row.query_number, 'rejected')}
                                  className="h-9 whitespace-nowrap rounded-md bg-brand-red px-3 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
                                >
                                  Reject payment
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {total > 0 && (
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Page {page} of {totalPages} · {total} queries
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
