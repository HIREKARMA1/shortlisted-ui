'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

type Tag = {
  label: string;
  icon?: LucideIcon;
  tone?: 'primary' | 'blue' | 'orange';
};

const tagToneClass: Record<NonNullable<Tag['tone']>, string> = {
  primary: 'bg-primary-50 text-primary-800',
  blue: 'bg-blue-50 text-blue-800',
  orange: 'bg-orange-50 text-orange-800',
};

type ManagementPageHeaderProps = {
  title: string;
  subtitle: string;
  tags?: Tag[];
  actions?: React.ReactNode;
};

export function ManagementPageHeader({ title, subtitle, tags = [], actions }: ManagementPageHeaderProps) {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-primary-100 p-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-ink-primary md:text-3xl">{title}</h1>
            <p className="mt-2 text-base text-ink-muted">{subtitle}</p>
            {tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag, index) => {
                  const Icon = tag.icon;
                  return (
                    <motion.span
                      key={tag.label}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.35, delay: index * 0.08 }}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${tagToneClass[tag.tone || 'primary']}`}
                    >
                      {Icon ? <Icon className="mr-1.5 h-4 w-4" /> : null}
                      {tag.label}
                    </motion.span>
                  );
                })}
              </div>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
        </div>
      </motion.div>
    </div>
  );
}
