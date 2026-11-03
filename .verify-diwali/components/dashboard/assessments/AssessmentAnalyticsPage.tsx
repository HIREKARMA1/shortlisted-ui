"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Loader2, Search, Filter, ArrowLeft, Download, Brain, Target, Users, Calendar, Clock, BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import type { DashboardRole } from '@/lib/dashboard-nav'
import { assessmentBasePath } from '@/lib/assessmentDashboard'
import {
    exportAnalyticsToCSV,
    buildAppliedStudentLookups,
    resolveAppliedStudentProfile,
    mapAttemptStudentProfileToExport,
    type AppliedStudentExport,
} from '@/utils/exportToExcel'
import {
    formatAttemptPercentage,
    formatAttemptScore,
    getAttemptMaxScore,
    getAttemptResultBadgeClass,
    getAttemptResultHint,
    getAttemptResultLabel,
    getAttemptResultState,
    getPassFailLabel,
    getPassFailBadgeClass,
    getTotalQuestionsFromAssessment,
    isAttemptEvaluated,
} from '@/lib/assessmentAnalytics'
import {
    buildProctoringSlots,
    countCapturedSnapshots,
    resolveSnapshotUrl,
} from '@/lib/proctoringSnapshots'

export function AssessmentAnalyticsPage({ role }: { role: DashboardRole }) {
    const params = useParams()
    const router = useRouter()
    const assessmentId = params.id as string
    const basePath = assessmentBasePath(role)

    const [attempts, setAttempts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState('ALL')
    const [assessmentDetails, setAssessmentDetails] = useState<any>(null)
    const [selectedAttempt, setSelectedAttempt] = useState<any>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pullingResults, setPullingResults] = useState(false)
    const [pullMessage, setPullMessage] = useState<string | null>(null)
    const [exporting, setExporting] = useState(false)

    useEffect(() => {
        if (assessmentId) {
            fetchData()
        }
    }, [assessmentId])

    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch attempts and assessment details in parallel
            const [attemptsData, assessmentData] = await Promise.all([
                api.getAssessmentAttempts(assessmentId),
                api.getAssessment(assessmentId),
            ])

            setAttempts(attemptsData)
            setAssessmentDetails(assessmentData)
        } catch (err: any) {
            console.error('Failed to fetch data:', err)
            setError(err.message || 'Failed to load analytics data')
        } finally {
            setLoading(false)
        }
    }

    // Filter logic
    const filteredAttempts = attempts.filter(attempt => {
        const matchesSearch =
            (attempt.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
            (attempt.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (attempt.student_id || '').toLowerCase().includes(search.toLowerCase())
        const matchesStatus = filterStatus === 'ALL' || attempt.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PASSED': return 'border border-brand-green/30 bg-brand-green/10 text-brand-green'
            case 'FAILED': return 'border border-brand-red/30 bg-brand-red/10 text-brand-red'
            case 'COMPLETED': return 'border border-brand-blue/30 bg-primary-50 text-brand-blue'
            default: return 'border border-line bg-soft text-ink-secondary'
        }
    }

    const calculateStats = () => {
        // Hybrid calculation: Use backend provided stats if available
        if (assessmentDetails?.pass_rate !== undefined || assessmentDetails?.stats?.pass_rate !== undefined) {
            return {
                passRate: assessmentDetails.pass_rate ?? assessmentDetails.stats.pass_rate,
                avgScore: assessmentDetails.avg_score ?? assessmentDetails.stats.avg_score ?? 0
            }
        }

        const total = attempts.length
        if (total === 0) return { passRate: 0, avgScore: 0 }

        const passed = attempts.filter(a => a.status === 'PASSED').length
        const totalScore = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0)
        const avgPct = (totalScore / total).toFixed(1)

        // If 'passed' count is 0 but we have valid attempts, the user might want to see the Average Performance 
        // in the "Pass Rate" slot if they are confusing terms, OR we can stick to strict "Pass Rate".
        // Given the request "passing rate should show the 35 percent" (which is the avg score),
        // we will ensure the Average Score card shows it clearly, but for Pass Rate, 
        // if the status is strictly relied upon, 0 is correct for FAIL. 
        // However, to be helpful, if N=1, Pass Rate = 0 is discouraging/confusing if they just want "Score".
        // Let's keep Pass Rate strict but ensure Average Score is highlighted.

        return {
            passRate: ((passed / total) * 100).toFixed(1),
            avgScore: avgPct
        }
    }

    const stats = calculateStats()
    const totalQuestions =
        getTotalQuestionsFromAssessment(assessmentDetails) ||
        (attempts[0]?.total_questions as number | undefined) ||
        0

    const handleExport = async () => {
        if (!assessmentDetails || !filteredAttempts.length) return

        try {
            setExporting(true)

            const jobId = null

            let appliedLookups = buildAppliedStudentLookups([])

            if (jobId) {
                // Shortlisted assessments are batch-scoped; no job application export.
            }

            const exportData = filteredAttempts.map((attempt) => {
                const maxScore = getAttemptMaxScore(attempt, assessmentDetails)
                const passFail = getPassFailLabel(attempt, assessmentDetails)
                const jobApplication = resolveAppliedStudentProfile(attempt, appliedLookups)
                const profile = mapAttemptStudentProfileToExport(attempt, jobApplication)

                return {
                    email: attempt.email || attempt.student_email || '-',
                    student_name: attempt.student_name || 'Unknown',
                    status: attempt.status,
                    total_score: attempt.total_score,
                    max_score: maxScore,
                    percentage: attempt.percentage,
                    pass_fail: passFail,
                    rounds_completed: attempt.result_data?.rounds?.length || 0,
                    snapshot_1_url: resolveSnapshotUrl(attempt.proctoring_snapshot_1_url),
                    snapshot_2_url: resolveSnapshotUrl(attempt.proctoring_snapshot_2_url),
                    snapshot_3_url: resolveSnapshotUrl(attempt.proctoring_snapshot_3_url),
                    snapshot_4_url: resolveSnapshotUrl(attempt.proctoring_snapshot_4_url),
                    profile,
                }
            })

            exportAnalyticsToCSV(exportData, assessmentDetails.assessment_name || 'Assessment')
        } finally {
            setExporting(false)
        }
    }

    const hasAwaitingResults = attempts.some(
        (a) => getAttemptResultState(a, assessmentDetails) === 'awaiting_results'
    )
    const incompleteCount = attempts.filter(
        (a) => getAttemptResultState(a, assessmentDetails) === 'not_finished'
    ).length
    const awaitingCount = attempts.filter(
        (a) => getAttemptResultState(a, assessmentDetails) === 'awaiting_results'
    ).length
    const inProgressCount = attempts.filter(
        (a) => getAttemptResultState(a, assessmentDetails) === 'in_progress'
    ).length

    const handlePullSolviqResults = async () => {
        try {
            setPullingResults(true)
            setPullMessage(null)
            const result = await api.pullSolviqResults(assessmentId)
            const pushed = result?.pushed?.length ?? 0
            const reevaluated = result?.reevaluated?.length ?? 0
            const failed = result?.failed?.length ?? 0
            setPullMessage(
                `Solviq reported ${pushed} result(s) sent, ${reevaluated} re-evaluated` +
                    (failed ? `, ${failed} could not be sent.` : '. Refreshing…')
            )
            await fetchData()
        } catch (err: any) {
            const detail =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                err?.message
            setPullMessage(
                typeof detail === 'string'
                    ? detail
                    : 'Could not pull results from Solviq'
            )
        } finally {
            setPullingResults(false)
        }
    }

    return (
        <DashboardLayout role={role} title="Assessment Analytics">
            <div className="space-y-6 pb-10">
                {/* Header Section */}
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {assessmentDetails?.assessment_name || 'Assessment'} Analytics 📊
                            </h1>
                            <p className="text-gray-600 text-lg mb-3">
                                Detailed insights and student performance records ✨
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                    🎓 Student Reports
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {totalQuestions > 0 && (
                    <p className="text-sm text-gray-600">
                        This assessment has <strong>{totalQuestions}</strong> questions across{' '}
                        {assessmentDetails?.rounds?.length ?? 0} round(s).
                    </p>
                )}

                {(hasAwaitingResults || incompleteCount > 0 || inProgressCount > 0) && (
                    <div className="space-y-3">
                        {incompleteCount > 0 && (
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                                <p className="font-semibold">
                                    {incompleteCount} student{incompleteCount === 1 ? '' : 's'} did not finish the exam
                                </p>
                                <p className="mt-1 text-slate-600">
                                    These attempts show as <strong>NOT FINISHED</strong>. The exam window has ended and
                                    there is no completed result from Solviq. Pulling results will not create a score
                                    for these students.
                                </p>
                            </div>
                        )}
                        {inProgressCount > 0 && (
                            <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                                <p className="font-semibold">
                                    {inProgressCount} student{inProgressCount === 1 ? '' : 's'} still in progress
                                </p>
                                <p className="mt-1 text-sky-800/90">
                                    The exam window is still open. These students started but have not submitted a
                                    finished result yet.
                                </p>
                            </div>
                        )}
                        {hasAwaitingResults && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="font-semibold">
                                            {awaitingCount} result{awaitingCount === 1 ? '' : 's'} still pending from Solviq
                                        </p>
                                        <p className="mt-1 text-amber-800/90">
                                            These students appear to have progressed on Solviq, but scores have not
                                            synced yet. Use the button to ask Solviq to send scores again.
                                        </p>
                                        {pullMessage && (
                                            <p className="mt-2 text-amber-900">{pullMessage}</p>
                                        )}
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="shrink-0 border-amber-300 bg-white hover:bg-amber-50"
                                        onClick={handlePullSolviqResults}
                                        disabled={pullingResults}
                                    >
                                        {pullingResults ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                        )}
                                        Pull results from Solviq
                                    </Button>
                                </div>
                            </div>
                        )}
                        {!hasAwaitingResults && pullMessage && (
                            <div className="rounded-lg border border-line bg-soft p-3 text-sm text-ink-secondary">
                                {pullMessage}
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md bg-blue-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Total Attempts
                                </p>
                                <div className="text-2xl font-bold text-gray-900">
                                    {attempts.length}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white shadow-sm">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md bg-green-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Pass Rate
                                </p>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.passRate}%
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white shadow-sm">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md bg-purple-50">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    Average Score
                                </p>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.avgScore}%
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white shadow-sm">
                                <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b border-gray-200 bg-white flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Student Name or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:outline-none"
                            />
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all focus:outline-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PASSED">Passed</option>
                                <option value="FAILED">Failed</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </div>
                        <Button
                            variant="secondary"
                            className="gap-2"
                            onClick={handleExport}
                            disabled={filteredAttempts.length === 0 || exporting}
                        >
                            {exporting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Download size={16} />
                            )}
                            Export CSV
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                                <p className="text-gray-500 text-sm">Loading results...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                                    <span className="text-red-600 font-bold text-xl">!</span>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Error Loading Results</h3>
                                <p className="text-gray-500 text-sm mb-4">{error}</p>
                                <Button onClick={fetchData} variant="secondary">
                                    Try Again
                                </Button>
                            </div>
                        ) : filteredAttempts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="bg-gray-50 p-4 rounded-full mb-3">
                                    <Filter className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="text-gray-900 font-medium">No results found</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {attempts.length === 0 ? "No student has attempted this assessment yet." : "No results match your filters."}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 text-gray-600 font-medium text-xs uppercase tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Score</th>
                                        <th className="px-6 py-4">Percentage</th>
                                        <th className="px-6 py-4">Pass/Fail</th>
                                        <th className="px-6 py-4">Rounds</th>
                                        <th className="px-6 py-4">Photos</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAttempts.map((attempt) => (
                                        <tr key={attempt.id} className="hover:bg-gray-50 transition-colors duration-200">
                                            {/* Student Name */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
                                                        {attempt.student_name ? attempt.student_name.substring(0, 2).toUpperCase() : 'ST'}
                                                    </div>
                                                    <span>{attempt.student_name || "Unknown Student"}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {(() => {
                                                    const state = getAttemptResultState(attempt, assessmentDetails)
                                                    return (
                                                        <div className="max-w-[14rem]">
                                                            <span
                                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${getAttemptResultBadgeClass(state)}`}
                                                            >
                                                                {getAttemptResultLabel(state)}
                                                            </span>
                                                            {state !== 'evaluated' && (
                                                                <p className="mt-1 text-[11px] leading-snug text-gray-500">
                                                                    {getAttemptResultHint(state)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )
                                                })()}
                                            </td>

                                            {/* Score */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatAttemptScore(attempt, assessmentDetails)}
                                            </td>

                                            {/* Percentage */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-semibold ${!isAttemptEvaluated(attempt) ? 'text-gray-500' :
                                                    (attempt.percentage ?? 0) >= 60 ? 'text-green-600' :
                                                        (attempt.percentage ?? 0) >= 40 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {formatAttemptPercentage(attempt)}
                                                </span>
                                            </td>

                                            {/* Pass/Fail */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {(() => {
                                                    const label = getPassFailLabel(attempt, assessmentDetails)
                                                    return (
                                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPassFailBadgeClass(label)}`}>
                                                            {label}
                                                        </span>
                                                    )
                                                })()}
                                            </td>

                                            {/* Rounds */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {attempt.result_data?.rounds?.length ?? '-'}
                                            </td>

                                            {/* Proctoring photos */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {countCapturedSnapshots(attempt)} / 4
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Button
                                                    variant="secondary"
                                                    className="h-8 gap-2"
                                                    onClick={() => {
                                                        setSelectedAttempt(attempt)
                                                        setIsModalOpen(true)
                                                    }}
                                                >
                                                    <Users size={14} />
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer */}
                    {!loading && !error && attempts.length > 0 && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 flex justify-between">
                            <span>Showing {filteredAttempts.length} of {attempts.length} attempts</span>
                        </div>
                    )}
                </div>

                {/* View Details Modal */}
                <AttemptDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    attempt={selectedAttempt}
                    assessment={assessmentDetails}
                    assessmentId={assessmentId}
                />
            </div>
        </DashboardLayout>
    )
}

function AttemptDetailsModal({
    isOpen,
    onClose,
    attempt,
    assessment,
    assessmentId,
}: {
    isOpen: boolean
    onClose: () => void
    attempt: any
    assessment: any
    assessmentId: string
}) {
    const [proctoring, setProctoring] = useState<any>(null)
    const [loadingProctoring, setLoadingProctoring] = useState(false)

    useEffect(() => {
        if (!isOpen || !attempt?.id) {
            setProctoring(null)
            return
        }

        const load = async () => {
            setLoadingProctoring(true)
            try {
                const data = await api.get(
                    `/admin/assessments/${assessmentId}/attempts/${attempt.id}/proctoring-snapshots`
                )
                setProctoring(data)
            } catch {
                setProctoring({
                    proctoring_snapshots: attempt.proctoring_snapshots,
                    proctoring_snapshot_1_url: attempt.proctoring_snapshot_1_url,
                    proctoring_snapshot_2_url: attempt.proctoring_snapshot_2_url,
                    proctoring_snapshot_3_url: attempt.proctoring_snapshot_3_url,
                    proctoring_snapshot_4_url: attempt.proctoring_snapshot_4_url,
                })
            } finally {
                setLoadingProctoring(false)
            }
        }

        void load()
    }, [isOpen, attempt?.id, assessmentId])

    if (!attempt) return null

    const evaluated = isAttemptEvaluated(attempt)
    const resultState = getAttemptResultState(attempt, assessment)
    const totalMaxScore = getAttemptMaxScore(attempt, assessment)
    const passFail = getPassFailLabel(attempt, assessment)
    const rounds = attempt.result_data?.rounds || []

    const photoSlots = buildProctoringSlots(
        proctoring?.proctoring_snapshots?.length
            ? proctoring.proctoring_snapshots
            : attempt.proctoring_snapshots,
        proctoring || attempt
    )

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${!isOpen && 'hidden'}`}>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-4">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Student Report: {attempt.student_name || attempt.student_id}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                        <ArrowLeft size={20} className="rotate-180" /> {/* Using generic close icon logic or X */}
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/50">

                    {!evaluated && resultState === 'not_finished' && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
                            <p className="font-semibold">Exam not finished</p>
                            <p className="mt-1 text-slate-600">
                                The exam window has ended and this student did not complete the assessment on Solviq
                                (status: {attempt.status || 'unknown'}). There is no score to show. Pulling results
                                will not create one.
                            </p>
                        </div>
                    )}

                    {!evaluated && resultState === 'in_progress' && (
                        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
                            <p className="font-semibold">Exam in progress</p>
                            <p className="mt-1">
                                This student started the assessment (status: {attempt.status || 'unknown'}). Scores
                                will appear after they finish and Solviq sends results.
                            </p>
                        </div>
                    )}

                    {!evaluated && resultState === 'awaiting_results' && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            <p className="font-semibold">Results pending from Solviq</p>
                            <p className="mt-1">
                                This attempt looks progressed on Solviq, but scores have not synced yet
                                (status: {attempt.status}). Use <strong>Pull results from Solviq</strong> on the
                                analytics page.
                            </p>
                        </div>
                    )}

                    {/* Summary Card */}
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Overall Score</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {evaluated && typeof attempt.total_score === 'number'
                                    ? attempt.total_score.toFixed(1)
                                    : '-'}{' '}
                                <span className="text-lg text-gray-400 font-normal">
                                    / {totalMaxScore > 0 ? totalMaxScore : '-'}
                                </span>
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Percentage</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatAttemptPercentage(attempt)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPassFailBadgeClass(passFail)}`}>
                                {passFail}
                            </span>
                        </div>
                    </div>

                    {/* Proctoring photos from Solviq */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Photos captured during assessment
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Identity verification snapshots from Solviq (up to 4, spread across the exam).
                        </p>
                        {!loadingProctoring && photoSlots.every((s) => !s.url) && evaluated && (
                            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                                No photos were stored for this attempt. The student must take a new exam with the webcam
                                enabled for the full duration. Older attempts completed before proctoring was fixed will
                                stay empty.
                            </p>
                        )}
                        {loadingProctoring ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {photoSlots.map((slot) =>
                                    slot.url ? (
                                        <a
                                            key={slot.index}
                                            href={slot.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block rounded-xl overflow-hidden border border-gray-200 bg-white hover:ring-2 hover:ring-blue-500"
                                        >
                                            <img
                                                src={slot.url}
                                                alt={`Photo ${slot.index}`}
                                                className="w-full aspect-[4/3] object-cover"
                                            />
                                            <div className="p-2 text-xs text-gray-600">
                                                <p className="font-semibold">Photo {slot.index}</p>
                                                {slot.captured_at && (
                                                    <p>{new Date(slot.captured_at).toLocaleString()}</p>
                                                )}
                                                {slot.round_number != null && (
                                                    <p>Round {slot.round_number}</p>
                                                )}
                                            </div>
                                        </a>
                                    ) : (
                                        <div
                                            key={slot.index}
                                            className="rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center aspect-[4/3] p-3 text-center bg-gray-50"
                                        >
                                            <p className="text-sm font-medium text-gray-500">Photo {slot.index}</p>
                                            <p className="text-xs text-gray-400 mt-1">Not captured</p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Round-wise Breakdown */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Round-wise Scores</h3>

                        {rounds.length > 0 ? rounds.map((round: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                                {/* Round Header */}
                                <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                                    <h4 className="font-semibold text-gray-900">
                                        Round {round.round_number}: {round.round_name}
                                    </h4>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900">
                                            {round.score?.toFixed(1) ?? '-'} / {round.total_score ?? userEstimateRoundTotal(round)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {round.percentage?.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Questions List */}
                                <div className="divide-y divide-gray-100">
                                    {round.questions?.map((q: any, qIdx: number) => (
                                        <div key={qIdx} className="p-6 hover:bg-gray-50/50 transition-colors">
                                            {/* Question Header */}
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <div className="flex-1">
                                                    <span className="text-gray-400 font-medium text-sm block mb-1">Q{qIdx + 1}:</span>
                                                    <p className="font-semibold text-gray-900 text-base leading-relaxed">
                                                        {q.question_text}
                                                    </p>
                                                </div>
                                                <span className={`shrink-0 flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold shadow-sm ${q.score > 0 ? 'bg-blue-600 text-white' : 'bg-red-100 text-red-600'
                                                    }`}>
                                                    {q.score > 0 ? (
                                                        <span className="flex items-center gap-1">
                                                            {q.score}/{q.max_score || 1}
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1">
                                                            {q.score}/{q.max_score || 1}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>

                                            {/* Answer & Feedback Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Student Answer */}
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <p className="text-xs text-gray-500 font-semibold mb-2">Student Answer:</p>
                                                    <p className="text-gray-700 font-medium whitespace-pre-wrap">
                                                        {q.student_answer || '-'}
                                                    </p>
                                                </div>

                                                {/* Feedback */}
                                                <div className={`p-4 rounded-lg border ${q.score > 0
                                                    ? 'bg-blue-50 border-blue-100'
                                                    : 'bg-red-50 border-red-100'
                                                    }`}>
                                                    <p className={`text-xs font-semibold mb-2 ${q.score > 0 ? 'text-blue-600' : 'text-red-600'
                                                        }`}>Feedback:</p>
                                                    <p className={`text-sm font-medium ${q.score > 0 ? 'text-blue-800' : 'text-red-800'
                                                        }`}>
                                                        {q.feedback || (q.score > 0 ? 'Correct (+1 points)' : 'Incorrect attempt')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500">
                                    {evaluated
                                        ? 'No detailed round data available for this attempt.'
                                        : 'Round-wise breakdown will appear after Solviq sends evaluation results to DISHA.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer to Close */}
                <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                    <Button onClick={onClose}>Close Report</Button>
                </div>
            </div>
        </div>
    )
}

function userEstimateRoundTotal(round: any) {
    if (round.questions && Array.isArray(round.questions)) {
        return round.questions.reduce((acc: number, q: any) => acc + (q.max_score || 1), 0)
    }
    if (round.percentage > 0 && round.score != null) {
        return Math.round(round.score / (round.percentage / 100))
    }
    return '-'
}
