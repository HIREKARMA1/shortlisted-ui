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
import { MinimalistClassicTemplate } from "./MinimalistClassic";
import { HarvardProfessionalTemplate } from "./HarvardProfessional";
import { SoftwareEngineerATSTemplate } from "./SoftwareEngineerATS";
import { DataAnalystATSTemplate } from "./DataAnalystATS";
import { ProjectManagerATSTemplate } from "./ProjectManagerATS";
import { FinanceBusinessATSTemplate } from "./FinanceBusinessATS";
import { SalesMarketingATSTemplate } from "./SalesMarketingATS";
import { ExecutiveEliteTemplate } from "./ExecutiveElite";
import { TechInnovatorTemplate } from "./TechInnovator";
import { ModernLuxuryTemplate } from "./ModernLuxury";
import { CreativePortfolioTemplate } from "./CreativePortfolio";
import { CorporateSignatureTemplate } from "./CorporateSignature";
import { MonochromePrestigeTemplate } from "./MonochromePrestige";
import { FinanceExecutiveTemplate } from "./FinanceExecutive";
import { RisingProfessionalTemplate } from "./RisingProfessional";
import { MarketingImpactTemplate } from "./MarketingImpact";
import { GlobalProfessionalTemplate } from "./GlobalProfessional";
import { ResumeData } from "./shared/types";

export type TemplateTier = "ats" | "premium";

export interface TemplateInfo {
  id: string;
  name: string;
  layout: string;
  font_family: string;
  font_size: string;
  description: string;
  category: string;
  tier: TemplateTier;
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
  "minimalist-classic",
  "harvard-professional",
  "software-engineer-ats",
  "data-analyst-ats",
  "project-manager-ats",
  "finance-business-ats",
  "sales-marketing-ats",
  "executive-elite",
  "tech-innovator",
  "modern-luxury",
  "creative-portfolio",
  "corporate-signature",
  "monochrome-prestige",
  "finance-executive",
  "rising-professional",
  "marketing-impact",
  "global-professional",
] as const;

export type TemplateSlug = (typeof TEMPLATE_SLUGS)[number];

/** Gallery shows exactly 15 ATS + 10 Premium = 25 templates. */
const SELECTABLE_TEMPLATE_SLUGS: TemplateSlug[] = [
  // ATS-Friendly (15)
  "classic-ats",
  "modern-professional",
  "executive-corporate",
  "minimal-ats",
  "executive-professional",
  "classic-ats-professional",
  "modern-ats-technical",
  "executive-ats-professional",
  "minimalist-classic",
  "harvard-professional",
  "software-engineer-ats",
  "data-analyst-ats",
  "project-manager-ats",
  "finance-business-ats",
  "sales-marketing-ats",
  // Premium (10)
  "executive-elite",
  "tech-innovator",
  "modern-luxury",
  "creative-portfolio",
  "corporate-signature",
  "monochrome-prestige",
  "finance-executive",
  "rising-professional",
  "marketing-impact",
  "global-professional",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
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
    tier: "ats",
    sections: 9,
    accentColor: "#0d9488",
  },
  "minimalist-classic": {
    id: "minimalist-classic",
    name: "Minimalist Classic",
    layout: "single-column",
    font_family: "Calibri",
    font_size: "10.5pt",
    description:
      "Clean single-column resume with simple typography for freshers and experienced professionals",
    category: "minimalist",
    tier: "ats",
    sections: 9,
    accentColor: "#222222",
  },
  "harvard-professional": {
    id: "harvard-professional",
    name: "Harvard Professional",
    layout: "single-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Traditional academic and corporate format with clear date alignment",
    category: "professional",
    tier: "ats",
    sections: 9,
    accentColor: "#000000",
  },
  "software-engineer-ats": {
    id: "software-engineer-ats",
    name: "Software Engineer",
    layout: "single-column",
    font_family: "Arial",
    font_size: "11pt",
    description:
      "Developer-focused ATS resume emphasizing technologies, projects, and measurable outcomes",
    category: "professional",
    tier: "ats",
    sections: 9,
    accentColor: "#111111",
  },
  "data-analyst-ats": {
    id: "data-analyst-ats",
    name: "Data Analyst",
    layout: "single-column",
    font_family: "Segoe UI",
    font_size: "11pt",
    description:
      "Analytics-focused resume highlighting SQL, BI tools, dashboards, and insights",
    category: "professional",
    tier: "ats",
    sections: 9,
    accentColor: "#1a1a1a",
  },
  "project-manager-ats": {
    id: "project-manager-ats",
    name: "Project Manager",
    layout: "single-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Delivery and leadership resume for Agile/Scrum, timelines, and stakeholder management",
    category: "executive",
    tier: "ats",
    sections: 9,
    accentColor: "#111111",
  },
  "finance-business-ats": {
    id: "finance-business-ats",
    name: "Finance & Business",
    layout: "single-column",
    font_family: "Calibri",
    font_size: "11pt",
    description:
      "Finance and business resume for reporting, forecasting, budgeting, and analysis",
    category: "professional",
    tier: "ats",
    sections: 9,
    accentColor: "#111111",
  },
  "sales-marketing-ats": {
    id: "sales-marketing-ats",
    name: "Sales & Marketing",
    layout: "single-column",
    font_family: "Arial",
    font_size: "11pt",
    description:
      "Sales and marketing resume emphasizing revenue growth, campaigns, and CRM tools",
    category: "professional",
    tier: "ats",
    sections: 9,
    accentColor: "#111111",
  },
  "executive-elite": {
    id: "executive-elite",
    name: "Executive Elite",
    layout: "single-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Navy and gold executive resume with refined typography for senior leadership",
    category: "executive",
    tier: "premium",
    sections: 9,
    accentColor: "#0f2744",
  },
  "tech-innovator": {
    id: "tech-innovator",
    name: "Tech Innovator",
    layout: "sidebar",
    font_family: "Segoe UI",
    font_size: "11pt",
    description:
      "Charcoal and teal technology layout with dedicated skills and project focus",
    category: "professional",
    tier: "premium",
    sections: 9,
    accentColor: "#0d9488",
  },
  "modern-luxury": {
    id: "modern-luxury",
    name: "Modern Luxury",
    layout: "single-column",
    font_family: "Times New Roman",
    font_size: "11pt",
    description:
      "Cream editorial resume with spacious typography for consultants and corporates",
    category: "minimalist",
    tier: "premium",
    sections: 9,
    accentColor: "#111111",
  },
  "creative-portfolio": {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    layout: "single-column",
    font_family: "Trebuchet MS",
    font_size: "11pt",
    description:
      "Terracotta-accent creative resume with strong portfolio presentation",
    category: "creative",
    tier: "premium",
    sections: 9,
    accentColor: "#c2410c",
  },
  "corporate-signature": {
    id: "corporate-signature",
    name: "Corporate Signature",
    layout: "single-column",
    font_family: "Arial",
    font_size: "11pt",
    description:
      "Royal blue corporate resume with clear hierarchy for business and operations",
    category: "professional",
    tier: "premium",
    sections: 9,
    accentColor: "#1d4ed8",
  },
  "monochrome-prestige": {
    id: "monochrome-prestige",
    name: "Monochrome Prestige",
    layout: "single-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Timeless black-and-white resume with elegant whitespace and hierarchy",
    category: "minimalist",
    tier: "premium",
    sections: 9,
    accentColor: "#000000",
  },
  "finance-executive": {
    id: "finance-executive",
    name: "Finance Executive",
    layout: "single-column",
    font_family: "Georgia",
    font_size: "11pt",
    description:
      "Deep green executive resume for finance, accounting, and banking roles",
    category: "executive",
    tier: "premium",
    sections: 9,
    accentColor: "#14532d",
  },
  "rising-professional": {
    id: "rising-professional",
    name: "Rising Professional",
    layout: "single-column",
    font_family: "Segoe UI",
    font_size: "11pt",
    description:
      "Light blue graduate-friendly design emphasizing education and projects",
    category: "professional",
    tier: "premium",
    sections: 9,
    accentColor: "#0284c7",
  },
  "marketing-impact": {
    id: "marketing-impact",
    name: "Marketing Impact",
    layout: "single-column",
    font_family: "Arial",
    font_size: "11pt",
    description:
      "Burgundy marketing resume highlighting campaigns, sales, and measurable results",
    category: "creative",
    tier: "premium",
    sections: 9,
    accentColor: "#9f1239",
  },
  "global-professional": {
    id: "global-professional",
    name: "Global Professional",
    layout: "two-column",
    font_family: "Calibri",
    font_size: "11pt",
    description:
      "Slate international corporate style for experienced global applicants",
    category: "professional",
    tier: "premium",
    sections: 9,
    accentColor: "#334155",
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
  "minimalist classic": "minimalist-classic",
  "harvard professional": "harvard-professional",
  "software engineer": "software-engineer-ats",
  "software engineer ats": "software-engineer-ats",
  "data analyst": "data-analyst-ats",
  "data analyst ats": "data-analyst-ats",
  "project manager": "project-manager-ats",
  "project manager ats": "project-manager-ats",
  "finance business": "finance-business-ats",
  "finance & business": "finance-business-ats",
  "finance and business": "finance-business-ats",
  "sales marketing": "sales-marketing-ats",
  "sales & marketing": "sales-marketing-ats",
  "sales and marketing": "sales-marketing-ats",
  "executive elite": "executive-elite",
  "tech innovator": "tech-innovator",
  "modern luxury": "modern-luxury",
  "creative portfolio": "creative-portfolio",
  "corporate signature": "corporate-signature",
  "monochrome prestige": "monochrome-prestige",
  "finance executive": "finance-executive",
  "rising professional": "rising-professional",
  "marketing impact": "marketing-impact",
  "global professional": "global-professional",
};

function normalizeTemplateKey(id: string): string {
  return id.toLowerCase().trim().replace(/_/g, "-");
}

export function getTemplateList(): TemplateInfo[] {
  return SELECTABLE_TEMPLATE_SLUGS.map((slug) => TEMPLATES[slug]);
}

export function getTemplatesByTier(tier: TemplateTier): TemplateInfo[] {
  return getTemplateList().filter((t) => t.tier === tier);
}

export function isTemplateSlug(id: string): id is TemplateSlug {
  return TEMPLATE_SLUGS.includes(id as TemplateSlug);
}

export function resolveTemplateSlug(
  templateId: string | null | undefined,
  settings?: Record<string, unknown>
): TemplateSlug {
  if (settings?.templateSlug) {
    const settingsSlug = String(settings.templateSlug);
    if (isTemplateSlug(settingsSlug)) {
      return settingsSlug;
    }
    const normalizedSettings = normalizeTemplateKey(settingsSlug);
    if (isTemplateSlug(normalizedSettings)) {
      return normalizedSettings;
    }
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
    const spaced = normalized.replace(/-/g, " ");
    if (TEMPLATE_NAME_MAP[spaced]) {
      return TEMPLATE_NAME_MAP[spaced];
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
    case "minimalist-classic":
      return MinimalistClassicTemplate;
    case "harvard-professional":
      return HarvardProfessionalTemplate;
    case "software-engineer-ats":
      return SoftwareEngineerATSTemplate;
    case "data-analyst-ats":
      return DataAnalystATSTemplate;
    case "project-manager-ats":
      return ProjectManagerATSTemplate;
    case "finance-business-ats":
      return FinanceBusinessATSTemplate;
    case "sales-marketing-ats":
      return SalesMarketingATSTemplate;
    case "executive-elite":
      return ExecutiveEliteTemplate;
    case "tech-innovator":
      return TechInnovatorTemplate;
    case "modern-luxury":
      return ModernLuxuryTemplate;
    case "creative-portfolio":
      return CreativePortfolioTemplate;
    case "corporate-signature":
      return CorporateSignatureTemplate;
    case "monochrome-prestige":
      return MonochromePrestigeTemplate;
    case "finance-executive":
      return FinanceExecutiveTemplate;
    case "rising-professional":
      return RisingProfessionalTemplate;
    case "marketing-impact":
      return MarketingImpactTemplate;
    case "global-professional":
      return GlobalProfessionalTemplate;
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
