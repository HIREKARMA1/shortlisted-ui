"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const NAVY = "#0f2744";
const GOLD = "#c5a572";

/** Premium — Executive Elite. ID: executive_elite */
export function ExecutiveEliteTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const title = resumeData.experience?.[0]?.position?.trim() || "";
  const contacts = contactParts(resumeData, { includeLinks: true });

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[10pt] font-bold uppercase tracking-[0.22em] mb-3 mt-5 pb-1.5"
      style={{ color: NAVY, borderBottom: `1px solid ${GOLD}` }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white text-[#1f2937] max-w-[800px] mx-auto text-[10.5pt] leading-[1.5]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <header
        className="px-10 pt-10 pb-7 text-center"
        style={{ background: `linear-gradient(180deg, ${NAVY} 0%, #163556 100%)` }}
      >
        <div className="mx-auto mb-3 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
        <h1 className="text-[22pt] font-bold tracking-[0.04em] text-white leading-tight">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {title ? (
          <p className="mt-2 text-[11pt] tracking-[0.12em] uppercase" style={{ color: GOLD }}>
            {title}
          </p>
        ) : null}
        {contacts.length > 0 && (
          <p
            className="mt-3 text-[9.5pt] text-white/85"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {contacts.join("  ·  ")}
          </p>
        )}
      </header>

      <div className="px-10 py-7">
        {resumeData.summary ? (
          <section>
            <Section>Professional Summary</Section>
            <p className="italic text-[#334155]" style={{ fontFamily: "Arial, sans-serif" }}>
              {resumeData.summary}
            </p>
          </section>
        ) : null}

        {achievements.length > 0 && (
          <section>
            <Section>Leadership Achievements</Section>
            <ul
              className="list-disc list-outside ml-5 space-y-1"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {achievements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {resumeData.experience?.length > 0 && (
          <section>
            <Section>Professional Experience</Section>
            <div className="space-y-4">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-3 items-baseline">
                    <h3 className="font-bold text-[11pt]" style={{ color: NAVY }}>
                      {exp.position || "Role"}
                    </h3>
                    <span
                      className="text-[9.5pt] text-[#64748b] whitespace-nowrap"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p
                    className="text-[10.5pt] font-medium"
                    style={{ color: GOLD, fontFamily: "Arial, sans-serif" }}
                  >
                    {[exp.company, exp.location].filter(Boolean).join(" — ")}
                  </p>
                  {filterEmpty(exp.description).length > 0 && (
                    <ul
                      className="list-disc list-outside ml-5 mt-1 space-y-0.5"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {filterEmpty(exp.description).map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(technical.length > 0 || soft.length > 0) && (
          <section>
            <Section>Core Competencies</Section>
            <p style={{ fontFamily: "Arial, sans-serif" }}>
              {[...technical, ...soft].join("  ·  ")}
            </p>
            {languages.length > 0 && (
              <p className="mt-1" style={{ fontFamily: "Arial, sans-serif" }}>
                <span className="font-bold">Languages: </span>
                {languages.join(", ")}
              </p>
            )}
          </section>
        )}

        {resumeData.education?.length > 0 && (
          <section>
            <Section>Education</Section>
            <div className="space-y-2">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index} className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-bold" style={{ color: NAVY }}>
                      {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                    </h3>
                    <p style={{ fontFamily: "Arial, sans-serif" }}>{edu.institution}</p>
                  </div>
                  <span
                    className="text-[9.5pt] text-[#64748b] whitespace-nowrap"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.certifications?.length > 0 && (
          <section>
            <Section>Certifications</Section>
            <ul
              className="list-disc list-outside ml-5 space-y-0.5"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {resumeData.certifications.map((cert, i) => (
                <li key={cert.id || i}>
                  <span className="font-bold">{cert.name}</span>
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                  {cert.date ? ` (${cert.date})` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
