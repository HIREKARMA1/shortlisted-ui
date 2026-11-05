"use client";

import { ComponentType } from "react";
import { ClassicATSTemplate } from "./ClassicATS";
import { ModernProfessionalTemplate } from "./ModernProfessional";
import { ExecutiveCorporateTemplate } from "./ExecutiveCorporate";
import { MinimalATSTemplate } from "./MinimalATS";
import { CreativePremiumTemplate } from "./CreativePremium";
import { ExecutiveProfessionalTemplate } from "./ExecutiveProfessional";
import { ModernCreativeTemplate } from "./ModernCreative";
import { ClassicATSProfessionalTemplate } from "./ClassicATSProfessional";
import { ModernATSTechnicalTemplate } from "./ModernATSTechnical";
import { ExecutiveATSProfessionalTemplate } from "./ExecutiveATSProfessional";
import { ResumeData } from "./shared/types";

export interface TemplateInfo {
  id: string;
  name: string;
  layout: string;
  font_family: string;
  font_size: string;
  description: string;
  category: string;
  sections: number;
  preview_image?: string;
  accentColor: string;
}

export const TEMPLATE_SLUGS = [
  "classic-ats",
  "modern-professional",
  "executive-corporate",
  "minimal-ats",
  "executive-professional",
  "modern-creative",
  "classic-ats-professional",
  "modern-ats-technical",
  "executive-ats-professional",
  "creative-premium",
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

/**
 * Selection page shows exactly these 8 templates (5 established + 3 new ATS).
 * Other registered slugs remain resolvable for saved resumes.
 */
const SELECTABLE_TEMPLATE_SLUGS: TemplateSlug[] = [
  "classic-ats",
  "modern-professional",
  "executive-corporate",
  "minimal-ats",
  "executive-professional",
  "classic-ats-professional",
  "modern-ats-technical",
  "executive-ats-professional",
];

export const TEMPLATES: Record<TemplateSlug, TemplateInfo> = {
  "classic-ats": {
    id: "classic-ats",
    name: "Classic ATS",
    layout: "single-column",
    font_family: "Arial",
    font_size: "11pt",
    description: "Traditional ATS-friendly resume template with clean layout",
    category: "professional",
    sections: 8,
    accentColor: "#1e40af",
  },
  "modern-professional": {
    id: "modern-professional",
    name: "Modern Professional",
    layout: "sidebar",
    font_family: "Segoe UI",
    font_size: "11pt",
    description:
      "Blue-accent sidebar layout with profile photo and skill progress bars",
    category: "professional",
    sections: 9,
    accentColor: "#1e40af",
  },
  "executive-corporate": {
    id: "executive-corporate",
    name: "Executive Corporate",
    layout: "two-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Elegant executive design with timeline experience and premium spacing",
    category: "executive",
    sections: 9,
    accentColor: "#1a365d",
  },
  "minimal-ats": {
    id: "minimal-ats",
    name: "Minimal ATS",
    layout: "single-column",
    font_family: "Calibri",
    font_size: "11pt",
    description:
      "Black and white ATS-optimized layout focused on maximum readability",
    category: "minimalist",
    sections: 9,
    accentColor: "#000000",
  },
  "executive-professional": {
    id: "executive-professional",
    name: "Executive Professional",
    layout: "single-column",
    font_family: "Segoe UI",
    font_size: "11pt",
    description:
      "Premium navy corporate layout with strong hierarchy and categorized skills",
    category: "executive",
    sections: 9,
    accentColor: "#0f172a",
  },
  "modern-creative": {
    id: "modern-creative",
    name: "Modern Creative",
    layout: "sidebar",
    font_family: "Inter",
    font_size: "11pt",
    description:
      "Teal-accent two-column design with sidebar for contact, skills, and education",
    category: "creative",
    sections: 9,
    accentColor: "#0d9488",
  },
  "classic-ats-professional": {
    id: "classic-ats-professional",
    name: "Classic ATS Professional",
    layout: "single-column",
    font_family: "Arial",
    font_size: "11pt",
    description:
      "Traditional Word-style ATS resume with black typography and thin divider lines",
    category: "professional",
    sections: 8,
    accentColor: "#111111",
  },
  "modern-ats-technical": {
    id: "modern-ats-technical",
    name: "Modern ATS Technical",
    layout: "single-column",
    font_family: "Calibri",
    font_size: "11pt",
    description:
      "Developer-focused ATS layout with categorized technical skills and project stacks",
    category: "professional",
    sections: 8,
    accentColor: "#222222",
  },
  "executive-ats-professional": {
    id: "executive-ats-professional",
    name: "Executive ATS Professional",
    layout: "single-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Senior corporate ATS resume with clear hierarchy and achievement emphasis",
    category: "executive",
    sections: 9,
    accentColor: "#111111",
  },
  "creative-premium": {
    id: "creative-premium",
    name: "Creative Premium",
    layout: "modern",
    font_family: "Inter",
    font_size: "11pt",
    description:
      "Stylish header with soft accent colors, icons, and modern dividers",
    category: "creative",
    sections: 9,
    accentColor: "#0d9488",
  },
};

const TEMPLATE_NAME_MAP: Record<string, TemplateSlug> = {
  "classic ats": "classic-ats",
  "modern professional": "modern-professional",
  "executive corporate": "executive-corporate",
  "minimal ats": "minimal-ats",
  "executive professional": "executive-professional",
  "modern creative": "modern-creative",
  "classic ats professional": "classic-ats-professional",
  "modern ats technical": "modern-ats-technical",
  "executive ats professional": "executive-ats-professional",
  "creative premium": "creative-premium",
};

function normalizeTemplateKey(id: string): string {
  return id.toLowerCase().trim().replace(/_/g, "-");
}

export function getTemplateList(): TemplateInfo[] {
  return SELECTABLE_TEMPLATE_SLUGS.map((slug) => TEMPLATES[slug]);
}

export function isTemplateSlug(id: string): id is TemplateSlug {
  return TEMPLATE_SLUGS.includes(id as TemplateSlug);
}

export function resolveTemplateSlug(
  templateId: string | null | undefined,
  settings?: Record<string, unknown>
): TemplateSlug {
  if (settings?.templateSlug && isTemplateSlug(settings.templateSlug as string)) {
    return settings.templateSlug as TemplateSlug;
  }

  if (templateId && isTemplateSlug(templateId)) {
    return templateId;
  }

  if (templateId) {
    const normalized = normalizeTemplateKey(templateId);
    if (isTemplateSlug(normalized)) {
      return normalized;
    }
    if (TEMPLATE_NAME_MAP[normalized]) {
      return TEMPLATE_NAME_MAP[normalized];
    }
  }

  return "classic-ats";
}

export function getTemplateComponent(
  templateId: string | null | undefined,
  settings?: Record<string, unknown>
): ComponentType<{ resumeData: ResumeData }> {
  const slug = resolveTemplateSlug(templateId, settings);

  switch (slug) {
    case "classic-ats":
      return ClassicATSTemplate;
    case "modern-professional":
      return ModernProfessionalTemplate;
    case "executive-corporate":
      return ExecutiveCorporateTemplate;
    case "minimal-ats":
      return MinimalATSTemplate;
    case "executive-professional":
      return ExecutiveProfessionalTemplate;
    case "modern-creative":
      return ModernCreativeTemplate;
    case "classic-ats-professional":
      return ClassicATSProfessionalTemplate;
    case "modern-ats-technical":
      return ModernATSTechnicalTemplate;
    case "executive-ats-professional":
      return ExecutiveATSProfessionalTemplate;
    case "creative-premium":
      return CreativePremiumTemplate;
    default:
      return ClassicATSTemplate;
  }
}

export function getTemplateInfo(
  templateId: string | null | undefined,
  settings?: Record<string, unknown>
): TemplateInfo | null {
  const slug = resolveTemplateSlug(templateId, settings);
  return TEMPLATES[slug] || null;
}
