'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Filter,
  Loader2,
  Search,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { assessmentBasePath } from '@/lib/assessmentDashboard';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

type ManagedAssessment = {
  id: string;
  assessment_name: string;
  external_id?: string;
  disha_assessment_id?: string;
  source?: string;
  total_students?: number;
  attempts_started?: number;
  attempts_completed?: number;
  results_status?: string;
  results_published?: boolean;
  visibility?: string;
  is_visible?: boolean;
  is_removed?: boolean;
  status?: string;
};

const PAGE_SIZE = 20;

export function AssessmentManagementPage({ role }: { role: DashboardRole }) {
  const router = useRouter();
  const basePath = assessmentBasePath(role);
  const [items, setItems] = useState<ManagedAssessment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('all');
  const [visibility, setVisibility] = useState('all');
  const [resultsStatus, setResultsStatus] = useState('all');
  const [pendingHide, setPendingHide] = useState<ManagedAssessment | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ManagedAssessment | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssessmentManagement({
        search: search.trim() || undefined,
        source: source === 'all' ? undefined : source,
        visibility: visibility === 'all' ? undefined : visibility,
        results_status: resultsStatus === 'all' ? undefined : resultsStatus,
        include_removed: true,
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      });
      setItems((data.items || []) as ManagedAssessment[]);
      setTotal(Number(data.total || 0));
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } }; message?: string })
        ?.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Failed to load assessments');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, resultsStatus, search, source, visibility]);

  useEffect(() => {
    load();
  }, [load]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const confirmHide = async () => {
    if (!pendingHide) return;
    setActing(true);
    try {
      const hide = pendingHide.visibility !== 'hidden';
      await api.setAssessmentVisibility(pendingHide.id, !hide);
      toast.success(hide ? 'Assessment hidden from students' : 'Assessment is visible again');
      setPendingHide(null);
      await load();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Could not update visibility');
    } finally {
      setActing(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setActing(true);
    try {
      await api.softRemoveAssessment(pendingDelete.id);
      toast.success('Assessment removed from Shortlisted');
      setPendingDelete(null);
      await load();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Could not remove assessment');
    } finally {
      setActing(false);
    }
  };

  return (
    <DashboardLayout role={role} title="Assessment Management">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Assessment Management</h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage Shortlisted and Disha-assigned assessments, visibility, and result publication.
              </p>
            </div>
            <Link href={`${basePath}/create`}>
              <Button className="normal-case tracking-normal">Create Shortlisted assessment</Button>
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="relative md:col-span-4">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => {
                  setPage(0);
                  setSearch(e.target.value);
                }}
                placeholder="Search by name or ID"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              />
            </div>
            <select
              value={source}
              onChange={(e) => {
                setPage(0);
                setSource(e.target.value);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:col-span-2"
            >
              <option value="all">All sources</option>
              <option value="disha">Disha</option>
              <option value="shortlisted">Shortlisted</option>
            </select>
            <select
              value={visibility}
              onChange={(e) => {
                setPage(0);
                setVisibility(e.target.value);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:col-span-2"
            >
              <option value="all">All visibility</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
            <select
              value={resultsStatus}
              onChange={(e) => {
                setPage(0);
                setResultsStatus(e.target.value);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm md:col-span-2"
            >
              <option value="all">All results</option>
              <option value="published">Published</option>
              <option value="not_published">Not published</option>
            </select>
            <button
              type="button"
              onClick={() => load()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 md:col-span-2"
            >
              <Filter className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No assessments found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Assign assessments from Disha Admin or create a Shortlisted assessment.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Assessment</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Students</th>
                    <th className="px-4 py-3">Attempts</th>
                    <th className="px-4 py-3">Completed</th>
                    <th className="px-4 py-3">Results</th>
                    <th className="px-4 py-3">Visibility</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((row) => {
                    const removed = Boolean(row.is_removed) || row.status === 'DELETED';
                    const hidden = row.visibility === 'hidden' || row.is_visible === false;
                    return (
                      <tr key={`${row.source}-${row.id}`} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{row.assessment_name}</div>
                          <div className="font-mono text-xs text-slate-500">
                            {row.external_id || row.disha_assessment_id || row.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize">{row.source || '—'}</td>
                        <td className="px-4 py-3">{row.total_students ?? 0}</td>
                        <td className="px-4 py-3">{row.attempts_started ?? 0}</td>
                        <td className="px-4 py-3">{row.attempts_completed ?? 0}</td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-xs font-medium',
                              row.results_published
                                ? 'bg-green-50 text-green-800'
                                : 'bg-amber-50 text-amber-800'
                            )}
                          >
                            {row.results_published ? 'Published' : 'Not published'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-xs font-medium',
                              hidden ? 'bg-slate-100 text-slate-700' : 'bg-blue-50 text-blue-800'
                            )}
                          >
                            {hidden ? 'Hidden' : 'Visible'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              'rounded-full px-2 py-0.5 text-xs font-medium',
                              removed ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
                            )}
                          >
                            {removed ? 'Deleted' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white"
                              onClick={() => router.push(`${basePath}/${row.id}`)}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Manage
                            </button>
                            {!removed && (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-white"
                                onClick={() => setPendingHide(row)}
                              >
                                {hidden ? (
                                  <Eye className="h-3.5 w-3.5" />
                                ) : (
                                  <EyeOff className="h-3.5 w-3.5" />
                                )}
                                {hidden ? 'Unhide' : 'Hide'}
                              </button>
                            )}
                            {!removed && (
                              <button
                                type="button"
                                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                                onClick={() => setPendingDelete(row)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
              <span>
                Showing {items.length} of {total}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="h-8 normal-case tracking-normal"
                >
                  Previous
                </Button>
                <span>
                  Page {page + 1} / {pageCount}
                </span>
                <Button
                  variant="outline"
                  disabled={page + 1 >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 normal-case tracking-normal"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!pendingHide}
        onClose={() => setPendingHide(null)}
        onConfirm={confirmHide}
        title={pendingHide?.visibility === 'hidden' ? 'Unhide assessment?' : 'Hide assessment?'}
        message={
          pendingHide?.visibility === 'hidden'
            ? 'Students will be able to see and start this assessment again if they are eligible.'
            : 'Students will no longer see this assessment in their list and cannot start new attempts. Existing attempts are preserved.'
        }
        confirmText={pendingHide?.visibility === 'hidden' ? 'Unhide' : 'Hide'}
        isLoading={acting}
        variant="warning"
      />

      <ConfirmationModal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        title="Remove assessment from Shortlisted?"
        message="Are you sure you want to remove this assessment from Shortlisted? Students will no longer be able to access it. Existing assessment attempts and results will be preserved according to the retention policy."
        confirmText="Remove"
        isLoading={acting}
        variant="danger"
      />
    </DashboardLayout>
  );
}
