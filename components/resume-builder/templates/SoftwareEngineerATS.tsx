"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import { categorizeSoftwareSkills } from "./shared/atsSkillCategories";

/**
 * Software Engineer ATS — developer-focused single-column resume.
 * Identifier: software_engineer_ats / software-engineer-ats
 */
export function SoftwareEngineerATSTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const buckets = categorizeSoftwareSkills(technical);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const title = resumeData.experience?.[0]?.position?.trim() || "Software Engineer";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.1em] text-black border-b-2 border-black pb-[2px] mb-2 mt-4">
      {children}
    </h2>
  );

  const SkillRow = ({ label, items }: { label: string; items: string[] }) => {
    if (!items.length) return null;
    return (
      <p className="text-[10.5pt] leading-relaxed">
        <span className="font-bold">{label}: </span>
        {items.join(", ")}
      </p>
    );
  };

  const contactLine = [
    resumeData.header?.email,
    resumeData.header?.phone,
    resumeData.header?.location,
  ]
    .filter(Boolean)
    .join("  |  ");

  const linksLine = [
    resumeData.header?.linkedin ? `LinkedIn: ${resumeData.header.linkedin}` : "",
    resumeData.header?.website ? `GitHub / Portfolio: ${resumeData.header.website}` : "",
  ]
    .filter(Boolean)
    .join("  |  ");

  return (
    <div
      className="bg-white text-[#111] p-10 pb-14 text-[11pt] leading-[1.42] max-w-[800px] mx-auto"
      style={{ fontFamily: "Arial, 'Segoe UI', Calibri, sans-serif", color: "#111" }}
    >
      <header className="mb-3">
        <h1 className="text-[18pt] font-bold text-black leading-tight">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        <p className="text-[11pt] font-semibold text-[#333] mt-0.5">{title}</p>
        {contactLine ? <p className="text-[10pt] text-[#444] mt-1.5">{contactLine}</p> : null}
        {linksLine ? (
          <p className="text-[10pt] text-[#444] mt-0.5 break-all">{linksLine}</p>
        ) : null}
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
            <SkillRow label="Programming Languages" items={buckets.programming} />
            <SkillRow label="Frameworks and Libraries" items={buckets.frameworks} />
            <SkillRow label="Databases" items={buckets.databases} />
            <SkillRow label="Tools and Technologies" items={buckets.tools} />
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
                    {exp.position || "Software Engineer"}
                    {exp.company ? ` | ${exp.company}` : ""}
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

      {resumeData.projects?.length > 0 && (
        <section>
          <SectionHeading>Technical Projects</SectionHeading>
          <div className="space-y-3">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Project"}</h3>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p className="text-[10pt] text-[#333] mt-0.5">
                    <span className="font-bold">Technologies: </span>
                    {filterEmpty(project.technologies).join(", ")}
                  </p>
                )}
                {(project.github || project.link) && (
                  <p className="text-[10pt] text-[#444] break-all">
                    {[project.github, project.link].filter(Boolean).join("  |  ")}
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
                    {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-[10.5pt] text-[#333]">
                  {[edu.institution, edu.location, edu.gpa ? `GPA ${edu.gpa}` : ""]
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
