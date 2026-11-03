"use client"

import { motion } from 'framer-motion'
import {
    Clock,
    Calendar,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    FileText,
    CheckCircle2,
    Link2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { buildStudentExamTakeUrl } from '@/lib/assessmentLinks'
import {
    formatAssessmentDate,
    getAssessmentCardColorScheme,
} from '@/components/assessments/assessmentCardTheme'
import { useState, useEffect, useRef } from 'react'

interface AssessmentCardProps {
    assessment: any;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
    onViewResults?: (id: string) => void;
    cardIndex?: number;
    basePath?: string;
}

export function AssessmentCard({
    assessment,
    onEdit,
    onDelete,
    onView,
    onViewResults,
    cardIndex = 0,
    basePath = '/dashboard/admin/assessments',
}: AssessmentCardProps) {
    const [showDropdown, setShowDropdown] = useState(false)
    const [linkCopied, setLinkCopied] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const canShareExamLink =
        assessment.status === 'ACTIVE' &&
        (assessment.is_published_to_solviq === true || assessment.is_published_to_solviq === undefined)

    const copyExamLink = async () => {
        try {
            await navigator.clipboard.writeText(buildStudentExamTakeUrl(assessment.id))
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch {
            // ignore
        }
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const cardColors = getAssessmentCardColorScheme(cardIndex)

    const getStatusColor = (status: string) => {
        const colors = {
            ACTIVE: 'bg-green-50 text-green-800',
            DRAFT: 'bg-gray-50 text-gray-800',
            COMPLETED: 'bg-blue-50 text-blue-800',
            ARCHIVED: 'bg-red-50 text-red-800'
        }
        return colors[status as keyof typeof colors] || colors.DRAFT
    }

    const getModeColor = (mode: string) => {
        const colors = {
            HIRING: 'bg-purple-50 text-purple-800',
            UNIVERSITY: 'bg-orange-50 text-orange-800',
            CORPORATE: 'bg-blue-50 text-blue-800',
        }
        return colors[mode as keyof typeof colors] || 'bg-gray-50 text-gray-800'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${cardColors.bg} rounded-xl border ${cardColors.border} ${cardColors.hover} transition-all duration-200 hover:shadow-md group flex flex-col h-full`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {assessment.assessment_name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono mt-1">
                            {assessment.disha_assessment_id || assessment.external_id}
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                getModeColor(assessment.mode)
                            )}>
                                {assessment.mode}
                            </span>
                            <span className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                getStatusColor(assessment.status)
                            )}>
                                {assessment.status}
                            </span>
                        </div>

                        {/* 3-dots dropdown menu */}
                        <div className="relative" ref={dropdownRef}>
                            <Button
                                variant="ghost"
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>

                            {showDropdown && (
                                <div className="absolute right-0 top-8 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <div className="py-1">
                                        <button
                                            onClick={() => {
                                                onView(assessment.id)
                                                setShowDropdown(false)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>

                                        {canShareExamLink && (
                                            <button
                                                onClick={async () => {
                                                    await copyExamLink()
                                                    setShowDropdown(false)
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                                            >
                                                <Link2 className="w-4 h-4" />
                                                Copy student exam link
                                            </button>
                                        )}

                                        <button
                                            onClick={() => {
                                                onEdit(assessment.id)
                                                setShowDropdown(false)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Configuration
                                        </button>

                                        <button
                                            onClick={() => {
                                                onDelete(assessment.id)
                                                setShowDropdown(false)
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete Assessment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="truncate">{assessment.total_duration_minutes} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="truncate">{assessment.round_count} Rounds</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 col-span-2">
                        <Calendar className="w-4 h-4" />
                        <span className="truncate">Created: {formatAssessmentDate(assessment.created_at)}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {assessment.description || "No description provided."}
                </p>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                    {canShareExamLink && (
                        <Button
                            type="button"
                            onClick={copyExamLink}
                            className="flex h-9 w-full items-center gap-2 bg-indigo-600 text-sm font-semibold normal-case tracking-normal hover:bg-indigo-700"
                        >
                            <Link2 className="h-4 w-4" />
                            {linkCopied ? 'Link copied!' : 'Copy student exam link'}
                        </Button>
                    )}
                    <Button
                        onClick={() => onViewResults ? onViewResults(assessment.id) : onView(assessment.id)}
                        variant="secondary"
                        className="flex h-9 w-full items-center gap-2 border-gray-200 text-sm font-semibold normal-case tracking-normal transition-all duration-200 hover:border-gray-300 hover:shadow-md group-hover:bg-white/50"
                    >
                        <FileText className="h-4 w-4" />
                        Result Analytics
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
