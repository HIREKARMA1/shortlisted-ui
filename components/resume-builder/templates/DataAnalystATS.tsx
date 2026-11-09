"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import { categorizeDataSkills } from "./shared/atsSkillCategories";

/**
 * Data Analyst ATS — analytics-focused single-column resume.
 * Identifier: data_analyst_ats / data-analyst-ats
 */
export function DataAnalystATSTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const buckets = categorizeDataSkills(technical);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const title = resumeData.experience?.[0]?.position?.trim() || "Data Analyst";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[11pt] font-bold text-[#1a1a1a] border-b border-[#1a1a1a] pb-[2px] mb-2 mt-4 tracking-wide">
      {children}
    </h2>
  );

  const SkillRow = ({ label, items }: { label: string; items: string[] }) => {
    if (!items.length) return null;
    return (
      <p className="text-[10.5pt]">
        <span className="font-bold">{label}: </span>
        {items.join(", ")}
      </p>
    );
  };

  const contactParts = [
    resumeData.header?.email,
    resumeData.header?.phone,
    resumeData.header?.location,
    resumeData.header?.linkedin,
    resumeData.header?.website,
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-[#1a1a1a] p-10 pb-14 text-[11pt] leading-[1.45] max-w-[800px] mx-auto"
      style={{ fontFamily: "'Segoe UI', Calibri, Arial, sans-serif", color: "#1a1a1a" }}
    >
      <header className="mb-4 text-left">
        <h1 className="text-[17pt] font-bold text-black mb-0.5">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        <p className="text-[10.5pt] font-medium text-[#444] mb-1.5">{title}</p>
        {contactParts.length > 0 && (
          <p className="text-[9.5pt] text-[#555]">{contactParts.join("  ·  ")}</p>
        )}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[10.5pt]">{resumeData.summary}</p>
        </section>
      ) : null}

      {(technical.length > 0 || soft.length > 0 || languages.length > 0) && (
        <section>
          <SectionHeading>Technical Skills</SectionHeading>
          <div className="space-y-0.5">
            <SkillRow label="SQL and Databases" items={buckets.sql} />
            <SkillRow label="Python and Analytics Tools" items={buckets.pythonAnalytics} />
            <SkillRow label="Excel and BI Tools" items={buckets.excelBi} />
            <SkillRow label="Additional Technical" items={buckets.other} />
            <SkillRow label="Soft Skills" items={soft} />
            <SkillRow label="Languages" items={languages} />
          </div>
        </section>
      )}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="space-y-3">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">
                    {exp.position || "Data Analyst"} — {exp.company || "Company"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.location ? (
                  <p className="text-[10pt] text-[#555] italic">{exp.location}</p>
                ) : null}
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
          <SectionHeading>Data Analytics Projects</SectionHeading>
          <div className="space-y-3">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Project"}</h3>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p className="text-[10pt] text-[#444] mt-0.5">
                    <span className="font-bold">Tools: </span>
                    {filterEmpty(project.technologies).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resumeData.education?.length > 0 && (
        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-2">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">
                    {edu.institution || "Institution"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-[10.5pt] text-[#333]">
                  {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {resumeData.certifications?.length > 0 && (
        <section>
          <SectionHeading>Certifications</SectionHeading>
          <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]">
            {resumeData.certifications.map((cert, index) => (
              <li key={cert.id || index}>
                <span className="font-bold">{cert.name}</span>
                {cert.issuer ? `, ${cert.issuer}` : ""}
                {cert.date ? ` — ${cert.date}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}

      {achievements.length > 0 && (
        <section>
          <SectionHeading>Achievements</SectionHeading>
          <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]">
            {achievements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
