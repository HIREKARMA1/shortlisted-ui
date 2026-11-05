'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Filter } from 'lucide-react'
import { Button } from '@/components/resume-builder/ui/Button'
import { ResumeBuilderDashboard } from './ResumeBuilderDashboard'
import { TemplateSelection } from './TemplateSelection'
import { ResumeBuilder } from './ResumeBuilder'
import { ResumeUpgradeModal } from './ResumeUpgradeModal'
import { ResumeUsageIndicator } from './ResumeUsageIndicator'
import { useProfile } from '@/hooks/useProfile'
import { useResumeUsage } from '@/hooks/useResumeUsage'

type ResumeBuilderView = 'dashboard' | 'templates' | 'builder'

export function ResumeBuilderPage() {
    const { profile, loading, error } = useProfile()
    const resumeUsage = useResumeUsage()
    const [currentView, setCurrentView] = useState<ResumeBuilderView>('dashboard')
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [selectedResume, setSelectedResume] = useState<string | null>(null)

    useEffect(() => {
        console.log('ResumeBuilderPage - Profile loading:', loading)
        console.log('ResumeBuilderPage - Profile data:', profile)
        console.log('ResumeBuilderPage - Profile error:', error)
    }, [profile, loading, error])

    const handleNewResume = () => {
        if (!resumeUsage.guardCreate()) return
        setCurrentView('templates')
    }

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId)
        setCurrentView('builder')
    }

    const handleResumeSelect = (resumeId: string) => {
        setSelectedResume(resumeId)
        setCurrentView('builder')
    }

    const handleBackToDashboard = () => {
        setCurrentView('dashboard')
        setSelectedTemplate(null)
        setSelectedResume(null)
        void resumeUsage.refresh()
    }

    const handleBackToTemplates = () => {
        if (!resumeUsage.guardCreate()) return
        setCurrentView('templates')
        setSelectedTemplate(null)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Profile
                    </h3>
                    <p className="text-red-600 dark:text-red-300">{error}</p>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="space-y-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                        No Profile Data
                    </h3>
                    <p className="text-yellow-600 dark:text-yellow-300">
                        Unable to load profile data. Please try again.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-6 border border-primary-200 dark:border-primary-700 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Resume Builder 📄
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-3">
                            Create professional resumes with our AI-powered builder ✨
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            <ResumeUsageIndicator
                                usage={resumeUsage.usage}
                                loading={resumeUsage.loading}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {currentView !== 'dashboard' && (
                            <Button
                                variant="outline"
                                onClick={handleBackToDashboard}
                                className="flex items-center space-x-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                            >
                                <FileText className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Button>
                        )}
                        {currentView === 'builder' && !selectedResume && (
                            <Button
                                variant="outline"
                                onClick={handleBackToTemplates}
                                className="flex items-center space-x-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Change Template</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {currentView === 'dashboard' && (
                    <ResumeBuilderDashboard
                        onNewResume={handleNewResume}
                        onEditResume={handleResumeSelect}
                        usage={resumeUsage.usage}
                        onUsageChange={resumeUsage.applyUsage}
                        onUpgradeRequest={resumeUsage.showUpgrade}
                        onApiLimitError={resumeUsage.handleApiError}
                    />
                )}

                {currentView === 'templates' && (
                    <TemplateSelection
                        onTemplateSelect={handleTemplateSelect}
                    />
                )}

                {currentView === 'builder' && (
                    <ResumeBuilder
                        templateId={selectedTemplate}
                        resumeId={selectedResume}
                        usage={resumeUsage.usage}
                        onUsageChange={resumeUsage.applyUsage}
                        onUpgradeRequest={resumeUsage.showUpgrade}
                        onApiLimitError={resumeUsage.handleApiError}
                    />
                )}
            </motion.div>

            <ResumeUpgradeModal
                open={resumeUsage.upgradeOpen}
                reason={resumeUsage.upgradeReason}
                onClose={resumeUsage.closeUpgrade}
            />
        </div>
    )
}
