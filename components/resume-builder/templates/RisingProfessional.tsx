"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const SKY = "#0284c7";
const LIGHT = "#e0f2fe";
const INK = "#0c4a6e";

/** Premium — Rising Professional. ID: rising_professional */
export function RisingProfessionalTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[10.5pt] font-bold mb-2.5 mt-4 px-2 py-1 inline-block rounded"
      style={{ color: INK, backgroundColor: LIGHT }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white max-w-[800px] mx-auto text-[10.5pt] leading-[1.45] text-[#0f172a]"
      style={{ fontFamily: "'Segoe UI', Calibri, Arial, sans-serif" }}
    >
      <header className="px-9 pt-8 pb-5" style={{ borderBottom: `3px solid ${SKY}` }}>
        <h1 className="text-[20pt] font-bold tracking-tight" style={{ color: INK }}>
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        <p className="text-[11pt] mt-1 font-medium" style={{ color: SKY }}>
          {resumeData.experience?.[0]?.position?.trim() ||
            resumeData.education?.[0]?.degree ||
            "Emerging Professional"}
        </p>
        {contacts.length > 0 && (
          <p className="text-[9.5pt] text-[#475569] mt-2">{contacts.join("  ·  ")}</p>
        )}
      </header>

      <div className="px-9 py-6 pb-10 space-y-1">
        {resumeData.summary ? (
          <section>
            <div>
              <Section>Professional Summary</Section>
            </div>
            <p className="text-[#334155]">{resumeData.summary}</p>
          </section>
        ) : null}

        {resumeData.education?.length > 0 && (
          <section>
            <div>
              <Section>Education</Section>
            </div>
            <div className="space-y-2.5">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <h3 className="font-bold text-[11pt]" style={{ color: INK }}>
                      {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                    </h3>
                    <span className="text-[9.5pt] text-[#64748b] whitespace-nowrap">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  </div>
                  <p className="text-[#475569]">
                    {[edu.institution, edu.location, edu.gpa ? `GPA ${edu.gpa}` : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {filterEmpty(edu.achievements).length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5">
                      {filterEmpty(edu.achievements).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.projects?.length > 0 && (
          <section>
            <div>
              <Section>Projects</Section>
            </div>
            <div className="space-y-3">
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="font-bold">{project.name || "Project"}</h3>
                  {project.description ? <p>{project.description}</p> : null}
                  {filterEmpty(project.technologies).length > 0 && (
                    <p className="text-[9.5pt] text-[#475569] mt-0.5">
                      Technologies: {filterEmpty(project.technologies).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.experience?.length > 0 && (
          <section>
            <div>
              <Section>Experience & Internships</Section>
            </div>
            <div className="space-y-3">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <h3 className="font-bold">
                      {exp.position}
                      {exp.company ? ` — ${exp.company}` : ""}
                    </h3>
                    <span className="text-[9.5pt] text-[#64748b] whitespace-nowrap">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
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

        {(technical.length > 0 || soft.length > 0) && (
          <section>
            <div>
              <Section>Skills</Section>
            </div>
            <p>{[...technical, ...soft].join(", ")}</p>
            {languages.length > 0 && (
              <p className="mt-1">Languages: {languages.join(", ")}</p>
            )}
          </section>
        )}

        {resumeData.certifications?.length > 0 && (
          <section>
            <div>
              <Section>Certifications</Section>
            </div>
            <ul className="list-disc list-outside ml-5 space-y-0.5">
              {resumeData.certifications.map((cert, i) => (
                <li key={cert.id || i}>
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                  {cert.date ? ` (${cert.date})` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {achievements.length > 0 &&
          !(resumeData.education || []).some((e) => filterEmpty(e.achievements).length) && (
            <section>
              <div>
                <Section>Achievements</Section>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-0.5">
                {achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}
      </div>
    </div>
  );
}
