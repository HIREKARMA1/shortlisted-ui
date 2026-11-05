'use client'

import { useCallback, useEffect, useState } from 'react'
import { resumeService } from '@/services/resumeService'
import {
  parseResumeUsageError,
  upgradeReasonFromErrorCode,
  type ResumeUpgradeReason,
  type ResumeUsage,
} from '@/lib/resumeUsage'

export function useResumeUsage() {
  const [usage, setUsage] = useState<ResumeUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<ResumeUpgradeReason>('usage_completed')

  const refresh = useCallback(async () => {
    try {
      const next = await resumeService.getUsage()
      setUsage(next)
      return next
    } catch (error) {
      console.error('Failed to load resume usage', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const showUpgrade = useCallback((reason: ResumeUpgradeReason) => {
    setUpgradeReason(reason)
    setUpgradeOpen(true)
  }, [])

  const closeUpgrade = useCallback(() => {
    setUpgradeOpen(false)
  }, [])

  const applyUsage = useCallback((next: ResumeUsage) => {
    setUsage(next)
    if (next.free_usage_completed && !next.is_paid) {
      showUpgrade('usage_completed')
    }
  }, [showUpgrade])

  const guardCreate = useCallback(() => {
    if (!usage) return true
    if (usage.can_create_resume) return true
    showUpgrade('create_limit')
    return false
  }, [usage, showUpgrade])

  const guardDownload = useCallback(() => {
    if (!usage) return true
    if (usage.can_download_pdf) return true
    showUpgrade('download_limit')
    return false
  }, [usage, showUpgrade])

  const handleApiError = useCallback(
    (error: unknown): boolean => {
      const detail = (error as { response?: { data?: { detail?: unknown } } })?.response?.data
        ?.detail
      const parsed = parseResumeUsageError(detail)
      if (!parsed) return false
      showUpgrade(upgradeReasonFromErrorCode(parsed.code))
      void refresh()
      return true
    },
    [refresh, showUpgrade]
  )

  return {
    usage,
    loading,
    refresh,
    applyUsage,
    upgradeOpen,
    upgradeReason,
    showUpgrade,
    closeUpgrade,
    guardCreate,
    guardDownload,
    handleApiError,
  }
}
