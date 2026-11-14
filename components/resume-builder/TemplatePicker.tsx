"use client";

import { useMemo, useState } from "react";
import {
  TemplateSlug,
  TemplateTier,
  getTemplateList,
} from "./templates/TemplateRegistry";
import { TemplateMiniPreview } from "./templates/TemplateMiniPreview";

interface TemplatePickerProps {
  selectedTemplateId: TemplateSlug;
  onTemplateChange: (templateId: TemplateSlug) => void;
  compact?: boolean;
}

export function TemplatePicker({
  selectedTemplateId,
  onTemplateChange,
  compact = false,
}: TemplatePickerProps) {
  const templates = getTemplateList();
  const [tierFilter, setTierFilter] = useState<"all" | TemplateTier>("all");

  const visible = useMemo(() => {
    if (tierFilter === "all") return templates;
    return templates.filter((t) => t.tier === tierFilter);
  }, [templates, tierFilter]);

  const filters: Array<{ id: "all" | TemplateTier; label: string }> = [
    { id: "all", label: "All" },
    { id: "ats", label: "ATS" },
    { id: "premium", label: "Premium" },
  ];

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTierFilter(f.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                tierFilter === f.id
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {visible.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateChange(template.id as TemplateSlug)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                selectedTemplateId === template.id
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary-400"
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Choose Template
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setTierFilter(f.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                tierFilter === f.id
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {visible.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onTemplateChange(template.id as TemplateSlug)}
            className={`text-left rounded-lg border-2 p-2 transition-all hover:shadow-md ${
              selectedTemplateId === template.id
                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
            }`}
          >
            <TemplateMiniPreview templateId={template.id as TemplateSlug} />
            <p className="text-xs font-medium text-gray-900 dark:text-white mt-2 truncate">
              {template.name}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
              {template.tier === "premium" ? "Premium" : "ATS"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
