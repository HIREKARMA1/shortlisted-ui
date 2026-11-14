"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import { categorizeByHints, PM_TOOLS } from "./shared/atsSkillCategories";

/**
 * Project Manager ATS — delivery/leadership-focused single-column resume.
 * Identifier: project_manager_ats / project-manager-ats
 */
export function ProjectManagerATSTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const competencies = [...soft, ...technical].filter(
    (s, i, arr) => arr.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === i
  );
  const toolBuckets = categorizeByHints([...technical, ...soft], PM_TOOLS);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const experience = resumeData.experience || [];
  const primaryRoles = experience;
  const title = experience[0]?.position?.trim() || "Project Manager";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[10pt] font-bold uppercase tracking-[0.16em] text-black border-b border-[#333] pb-[3px] mb-2.5 mt-5">
      {children}
    </h2>
  );

  const contactParts = [
    resumeData.header?.phone,
    resumeData.header?.email,
    resumeData.header?.location,
    resumeData.header?.linkedin,
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-[#111] p-11 pb-14 text-[11pt] leading-[1.48] max-w-[800px] mx-auto"
      style={{ fontFamily: "Georgia, 'Times New Roman', Arial, serif", color: "#111" }}
    >
      <header className="mb-4 pb-3 border-b border-black">
        <h1 className="text-[20pt] font-bold tracking-tight text-black">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        <p
          className="text-[11pt] text-[#333] mt-1 uppercase tracking-wide"
          style={{ fontFamily: "Arial, Calibri, sans-serif" }}
        >
          {title}
        </p>
        {contactParts.length > 0 && (
          <p
            className="text-[10pt] text-[#444] mt-2"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {contactParts.join("  |  ")}
          </p>
        )}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p
            className="text-[10.5pt]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {resumeData.summary}
          </p>
        </section>
      ) : null}

      {competencies.length > 0 && (
        <section>
          <SectionHeading>Core Competencies</SectionHeading>
          <p
            className="text-[10.5pt]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {competencies.join("  ·  ")}
          </p>
        </section>
      )}

      {primaryRoles.length > 0 && (
        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="space-y-3.5">
            {primaryRoles.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">
                    {exp.position || "Project Manager"}
                  </h3>
                  <span
                    className="text-[10pt] text-[#555] whitespace-nowrap"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p
                  className="text-[10.5pt] text-[#333]"
                  style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                >
                  {[exp.company, exp.location].filter(Boolean).join(" — ")}
                </p>
                {filterEmpty(exp.description).length > 0 && (
                  <ul
                    className="list-disc list-outside ml-5 mt-1 space-y-0.5 text-[10.5pt]"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
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
          <div className="space-y-2.5">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Project"}</h3>
                {project.description ? (
                  <p
                    className="text-[10.5pt] mt-0.5"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {project.description}
                  </p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p
                    className="text-[10pt] text-[#444] mt-0.5"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    <span className="font-bold">Scope / Tools: </span>
                    {filterEmpty(project.technologies).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(toolBuckets.matched.length > 0 || languages.length > 0) && (
        <section>
          <SectionHeading>Tools and Methodologies</SectionHeading>
          <p
            className="text-[10.5pt]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {[...toolBuckets.matched, ...toolBuckets.other.slice(0, 8)]
              .filter(Boolean)
              .join(", ")}
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
                  <span
                    className="text-[10pt] text-[#555] whitespace-nowrap"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p
                  className="text-[10.5pt] text-[#333]"
                  style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                >
                  {edu.institution}
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
          <ul
            className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
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
          <ul
            className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {achievements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
