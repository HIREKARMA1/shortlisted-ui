"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const ROYAL = "#1d4ed8";
const NAVY = "#1e3a8a";

/** Premium — Corporate Signature. ID: corporate_signature */
export function CorporateSignatureTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[10pt] font-bold uppercase tracking-[0.14em] mb-2.5 mt-5 pb-1"
      style={{ color: NAVY, borderBottom: `2px solid ${ROYAL}` }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white max-w-[800px] mx-auto text-[10.5pt] leading-[1.45] text-[#1e293b]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <header className="px-9 pt-0">
        <div className="h-2 w-full" style={{ backgroundColor: ROYAL }} />
        <div className="pt-7 pb-5">
          <h1 className="text-[20pt] font-bold tracking-tight" style={{ color: NAVY }}>
            {resumeData.header?.fullName || "Your Name"}
          </h1>
          {resumeData.experience?.[0]?.position ? (
            <p className="text-[11pt] font-semibold mt-1" style={{ color: ROYAL }}>
              {resumeData.experience[0].position}
            </p>
          ) : null}
          {contacts.length > 0 && (
            <p className="text-[9.5pt] text-[#64748b] mt-2">{contacts.join("  |  ")}</p>
          )}
        </div>
      </header>

      <div className="px-9 pb-10">
        {resumeData.summary ? (
          <section>
            <Section>Professional Summary</Section>
            <p>{resumeData.summary}</p>
          </section>
        ) : null}

        {resumeData.experience?.length > 0 && (
          <section>
            <Section>Professional Experience</Section>
            <div className="space-y-3.5">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <h3 className="font-bold text-[11pt]" style={{ color: NAVY }}>
                      {exp.position || "Role"}
                    </h3>
                    <span className="text-[9.5pt] text-[#64748b] whitespace-nowrap">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="font-medium text-[10.5pt]" style={{ color: ROYAL }}>
                    {[exp.company, exp.location].filter(Boolean).join(" · ")}
                  </p>
                  {filterEmpty(exp.description).length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5">
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

        {achievements.length > 0 && (
          <section>
            <Section>Key Achievements</Section>
            <ul className="list-disc list-outside ml-5 space-y-0.5">
              {achievements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {(technical.length > 0 || soft.length > 0) && (
          <section>
            <Section>Skills</Section>
            <p>{[...technical, ...soft].join(", ")}</p>
            {languages.length > 0 && (
              <p className="mt-1">Languages: {languages.join(", ")}</p>
            )}
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1">
          {resumeData.education?.length > 0 && (
            <section>
              <Section>Education</Section>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index} className="mb-2">
                  <h3 className="font-bold">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </h3>
                  <p className="text-[#475569]">{edu.institution}</p>
                  <p className="text-[9.5pt] text-[#64748b]">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </p>
                </div>
              ))}
            </section>
          )}

          {resumeData.certifications?.length > 0 && (
            <section>
              <Section>Certifications</Section>
              <ul className="list-disc list-outside ml-5 space-y-0.5">
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
            <Section>Projects</Section>
            <div className="space-y-2">
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="font-bold">{project.name}</h3>
                  {project.description ? <p>{project.description}</p> : null}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
