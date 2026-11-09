"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Check } from 'lucide-react'
import {
    getTemplateList,
    TemplateSlug,
    TEMPLATES,
    TemplateTier,
} from './templates/TemplateRegistry'
import { TemplateMiniPreview } from './templates/TemplateMiniPreview'

interface TemplateSelectionProps {
    onTemplateSelect: (templateId: string) => void
}

export function TemplateSelection({ onTemplateSelect }: TemplateSelectionProps) {
    const templates = getTemplateList()
    const [filteredTemplates, setFilteredTemplates] = useState(templates)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

    const atsCount = templates.filter((t) => t.tier === 'ats').length
    const premiumCount = templates.filter((t) => t.tier === 'premium').length

    const categories = [
        { id: 'all', name: 'All Templates', count: templates.length },
        { id: 'ats', name: 'ATS-Friendly', count: atsCount },
        { id: 'premium', name: 'Premium', count: premiumCount },
    ]

    useEffect(() => {
        let filtered = templates

        if (selectedCategory === 'ats' || selectedCategory === 'premium') {
            filtered = filtered.filter(
                (template) => template.tier === (selectedCategory as TemplateTier)
            )
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (template) =>
                    template.name.toLowerCase().includes(q) ||
                    template.description.toLowerCase().includes(q) ||
                    template.category.toLowerCase().includes(q)
            )
        }

        setFilteredTemplates(filtered)
    }, [selectedCategory, searchQuery, templates])

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId)
        setTimeout(() => {
            onTemplateSelect(templateId)
        }, 300)
    }

    const getTierBadge = (tier: TemplateTier) => {
        if (tier === 'premium') {
            return 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
        }
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
    }

    const getTemplateCardColor = (templateId: TemplateSlug) => {
        const accent = TEMPLATES[templateId]?.accentColor || '#3b82f6'
        return {
            background: `linear-gradient(135deg, ${accent}08 0%, ${accent}18 100%)`,
            borderColor: `${accent}30`,
        }
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                    selectedCategory === category.id
                                        ? 'bg-primary-500 text-white border-primary-500'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-primary-400'
                                }`}
                            >
                                {category.name} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {selectedCategory === 'all' && (
                <div className="space-y-8">
                    {(['ats', 'premium'] as TemplateTier[]).map((tier) => {
                        const tierTemplates = filteredTemplates.filter((t) => t.tier === tier)
                        if (tierTemplates.length === 0) return null
                        return (
                            <section key={tier}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {tier === 'ats' ? 'ATS-Friendly Templates' : 'Premium Templates'}
                                    </h2>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {tierTemplates.length} templates
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                                    {tierTemplates.map((template, index) => (
                                        <TemplateCard
                                            key={template.id}
                                            template={template}
                                            index={index}
                                            selected={selectedTemplate === template.id}
                                            onSelect={handleTemplateSelect}
                                            getTierBadge={getTierBadge}
                                            getTemplateCardColor={getTemplateCardColor}
                                        />
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </div>
            )}

            {selectedCategory !== 'all' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                    {filteredTemplates.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            index={index}
                            selected={selectedTemplate === template.id}
                            onSelect={handleTemplateSelect}
                            getTierBadge={getTierBadge}
                            getTemplateCardColor={getTemplateCardColor}
                        />
                    ))}
                </div>
            )}

            {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                        <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No templates found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            )}
        </div>
    )
}

function TemplateCard({
    template,
    index,
    selected,
    onSelect,
    getTierBadge,
    getTemplateCardColor,
}: {
    template: ReturnType<typeof getTemplateList>[number]
    index: number
    selected: boolean
    onSelect: (id: string) => void
    getTierBadge: (tier: TemplateTier) => string
    getTemplateCardColor: (id: TemplateSlug) => { background: string; borderColor: string }
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.4) }}
            className={`rounded-xl shadow-lg border transition-all duration-200 cursor-pointer hover:shadow-xl overflow-hidden ${
                selected ? 'ring-4 ring-primary-500 ring-opacity-50' : 'hover:scale-[1.02]'
            }`}
            style={getTemplateCardColor(template.id as TemplateSlug)}
            onClick={() => onSelect(template.id)}
        >
            <div className="p-4">
                <div className="relative">
                    <TemplateMiniPreview templateId={template.id as TemplateSlug} />
                    {selected && (
                        <div className="absolute top-3 right-3 bg-primary-500 text-white rounded-full p-2 shadow-lg z-10">
                            <Check className="w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="mt-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {template.name}
                        </h3>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${getTierBadge(
                                template.tier
                            )}`}
                        >
                            {template.tier === 'premium' ? 'Premium' : 'ATS-Friendly'}
                        </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">
                        {template.description}
                    </p>

                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <span>Layout:</span>
                            <span className="font-medium">{template.layout}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span>Font:</span>
                            <span className="font-medium">{template.font_family}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
