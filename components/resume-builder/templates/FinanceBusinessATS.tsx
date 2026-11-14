"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import { categorizeByHints, FINANCE_TOOLS } from "./shared/atsSkillCategories";

/**
 * Finance & Business ATS — finance/business professional single-column resume.
 * Identifier: finance_business_ats / finance-business-ats
 */
export function FinanceBusinessATSTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const financeSkills = [...technical, ...soft];
  const toolBuckets = categorizeByHints(technical, FINANCE_TOOLS);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const title =
    resumeData.experience?.[0]?.position?.trim() || "Finance Professional";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.08em] text-black mb-2 mt-4 pl-2 border-l-2 border-black">
      {children}
    </h2>
  );

  const contactParts = [
    resumeData.header?.email,
    resumeData.header?.phone,
    resumeData.header?.location,
    resumeData.header?.linkedin,
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-[#111] p-10 pb-14 text-[11pt] leading-[1.44] max-w-[800px] mx-auto"
      style={{ fontFamily: "Calibri, Arial, 'Segoe UI', sans-serif", color: "#111" }}
    >
      <header className="mb-4 text-center">
        <h1 className="text-[18pt] font-bold text-black tracking-tight">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        <p className="text-[11pt] text-[#333] mt-1">{title}</p>
        {contactParts.length > 0 && (
          <p className="text-[10pt] text-[#555] mt-2">{contactParts.join("  |  ")}</p>
        )}
        {resumeData.header?.website ? (
          <p className="text-[10pt] text-[#555] mt-0.5">{resumeData.header.website}</p>
        ) : null}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[10.5pt] px-1">{resumeData.summary}</p>
        </section>
      ) : null}

      {financeSkills.length > 0 && (
        <section>
          <SectionHeading>Financial and Business Skills</SectionHeading>
          <p className="text-[10.5pt] px-1">{financeSkills.join(", ")}</p>
          {languages.length > 0 && (
            <p className="text-[10.5pt] px-1 mt-1">
              <span className="font-bold">Languages: </span>
              {languages.join(", ")}
            </p>
          )}
        </section>
      )}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="space-y-3 px-1">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">
                    {exp.position || "Analyst"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-[10.5pt] text-[#333] font-medium">
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                </p>
                {filterEmpty(exp.description).length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-1 space-y-0.5 text-[10.5pt]">
                    {filterEmpty(exp.description).map((desc, i) => (
                      <li key={i}>{desc}</li>
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
          <SectionHeading>Key Projects</SectionHeading>
          <div className="space-y-2.5 px-1">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Project"}</h3>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p className="text-[10pt] text-[#444] mt-0.5">
                    {filterEmpty(project.technologies).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(toolBuckets.matched.length > 0 || toolBuckets.other.length > 0) && (
        <section>
          <SectionHeading>Tools and Technologies</SectionHeading>
          <p className="text-[10.5pt] px-1">
            {[...toolBuckets.matched, ...toolBuckets.other].join(", ")}
          </p>
        </section>
      )}

      {resumeData.education?.length > 0 && (
        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-2 px-1">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-[10.5pt] text-[#333]">
                  {[edu.institution, edu.gpa ? `GPA ${edu.gpa}` : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resumeData.certifications?.length > 0 && (
        <section>
          <SectionHeading>Certifications</SectionHeading>
          <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt] px-1">
            {resumeData.certifications.map((cert, index) => (
              <li key={cert.id || index}>
                <span className="font-bold">{cert.name}</span>
                {cert.issuer ? ` — ${cert.issuer}` : ""}
                {cert.date ? ` (${cert.date})` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {achievements.length > 0 && (
        <section>
          <SectionHeading>Achievements</SectionHeading>
          <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt] px-1">
            {achievements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
