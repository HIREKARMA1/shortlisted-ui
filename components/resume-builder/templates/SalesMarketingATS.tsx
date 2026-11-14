"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import { categorizeByHints, SALES_TOOLS } from "./shared/atsSkillCategories";

/**
 * Sales & Marketing ATS — revenue/growth-focused single-column resume.
 * Identifier: sales_marketing_ats / sales-marketing-ats
 */
export function SalesMarketingATSTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const competencies = [...soft, ...technical].filter(
    (s, i, arr) => arr.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === i
  );
  const toolBuckets = categorizeByHints([...technical, ...soft], SALES_TOOLS);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const title =
    resumeData.experience?.[0]?.position?.trim() || "Sales & Marketing Professional";

  // Split projects: first half as sales achievements narrative, rest as campaigns
  const projects = resumeData.projects || [];
  const mid = Math.ceil(projects.length / 2);
  const salesProjects = projects.length > 1 ? projects.slice(0, mid) : projects;
  const campaignProjects = projects.length > 1 ? projects.slice(mid) : [];

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[11pt] font-bold uppercase text-black mb-2 mt-4 pb-1 border-b border-[#999]">
      {children}
    </h2>
  );

  const contactParts = [
    resumeData.header?.phone,
    resumeData.header?.email,
    resumeData.header?.location,
    resumeData.header?.linkedin,
    resumeData.header?.website,
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-[#111] p-10 pb-14 text-[11pt] leading-[1.43] max-w-[800px] mx-auto"
      style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#111" }}
    >
      <header className="mb-4">
        <div className="flex justify-between items-end gap-4 border-b-2 border-black pb-2">
          <div>
            <h1 className="text-[17pt] font-bold text-black leading-tight">
              {resumeData.header?.fullName || "Your Name"}
            </h1>
            <p className="text-[10.5pt] text-[#333] mt-1 font-medium">{title}</p>
          </div>
        </div>
        {contactParts.length > 0 && (
          <p className="text-[9.5pt] text-[#555] mt-2">{contactParts.join("  ·  ")}</p>
        )}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[10.5pt]">{resumeData.summary}</p>
        </section>
      ) : null}

      {competencies.length > 0 && (
        <section>
          <SectionHeading>Core Competencies</SectionHeading>
          <p className="text-[10.5pt]">{competencies.join(" · ")}</p>
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
                    {exp.position || "Role"}
                    {exp.company ? `, ${exp.company}` : ""}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.location ? (
                  <p className="text-[10pt] text-[#555]">{exp.location}</p>
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

      {salesProjects.length > 0 && (
        <section>
          <SectionHeading>
            {campaignProjects.length > 0 ? "Sales Achievements" : "Sales Achievements & Campaigns"}
          </SectionHeading>
          <div className="space-y-2.5">
            {salesProjects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Initiative"}</h3>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {campaignProjects.length > 0 && (
        <section>
          <SectionHeading>Marketing Campaigns</SectionHeading>
          <div className="space-y-2.5">
            {campaignProjects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Campaign"}</h3>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p className="text-[10pt] text-[#444] mt-0.5">
                    Channels / Tools: {filterEmpty(project.technologies).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(toolBuckets.matched.length > 0 || toolBuckets.other.length > 0) && (
        <section>
          <SectionHeading>CRM and Marketing Tools</SectionHeading>
          <p className="text-[10.5pt]">
            {[...toolBuckets.matched, ...toolBuckets.other].join(", ")}
            {languages.length > 0 ? `. Languages: ${languages.join(", ")}` : ""}
          </p>
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
          <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]">
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
