"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const GREEN = "#14532d";
const ACCENT = "#166534";
const MUTED = "#3f6212";

/** Premium — Finance Executive. ID: finance_executive */
export function FinanceExecutiveTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[10pt] font-bold uppercase tracking-[0.16em] mb-2.5 mt-5 pb-1"
      style={{ color: GREEN, borderBottom: `1px solid ${MUTED}` }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white max-w-[800px] mx-auto text-[10.5pt] leading-[1.46] text-[#1c1917]"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <header className="px-10 pt-9 pb-5 border-b-2" style={{ borderColor: GREEN }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <h1 className="text-[21pt] font-bold tracking-tight" style={{ color: GREEN }}>
              {resumeData.header?.fullName || "Your Name"}
            </h1>
            {resumeData.experience?.[0]?.position ? (
              <p
                className="mt-1 text-[11pt] font-medium"
                style={{ color: ACCENT, fontFamily: "Arial, sans-serif" }}
              >
                {resumeData.experience[0].position}
              </p>
            ) : null}
          </div>
          {contacts.length > 0 && (
            <p
              className="text-[9.5pt] text-[#57534e] md:text-right max-w-xs"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              {contacts.join("\n").split("\n").join(" · ")}
            </p>
          )}
        </div>
      </header>

      <div className="px-10 py-6 pb-10">
        {resumeData.summary ? (
          <section>
            <Section>Executive Summary</Section>
            <p style={{ fontFamily: "Arial, sans-serif" }}>{resumeData.summary}</p>
          </section>
        ) : null}

        {achievements.length > 0 && (
          <section>
            <Section>Financial & Business Accomplishments</Section>
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
            <div className="space-y-3.5">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <h3 className="font-bold text-[11pt]" style={{ color: GREEN }}>
                      {exp.position || "Analyst"}
                    </h3>
                    <span
                      className="text-[9.5pt] text-[#78716c] whitespace-nowrap"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p
                    className="font-medium"
                    style={{ color: ACCENT, fontFamily: "Arial, sans-serif" }}
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
            <Section>Skills & Tools</Section>
            <p style={{ fontFamily: "Arial, sans-serif" }}>
              {[...technical, ...soft].join(", ")}
            </p>
            {languages.length > 0 && (
              <p className="mt-1" style={{ fontFamily: "Arial, sans-serif" }}>
                Languages: {languages.join(", ")}
              </p>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumeData.education?.length > 0 && (
            <section>
              <Section>Education</Section>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index} className="mb-2">
                  <h3 className="font-bold">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </h3>
                  <p style={{ fontFamily: "Arial, sans-serif" }}>{edu.institution}</p>
                  <p
                    className="text-[9.5pt] text-[#78716c]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </p>
                </div>
              ))}
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

        {resumeData.projects?.length > 0 && (
          <section>
            <Section>Key Initiatives</Section>
            <div className="space-y-2">
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="font-bold">{project.name}</h3>
                  {project.description ? (
                    <p style={{ fontFamily: "Arial, sans-serif" }}>{project.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
