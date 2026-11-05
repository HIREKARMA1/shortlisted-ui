"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

/**
 * Classic ATS Professional — Word/Docs-style single-column resume.
 * Black text, white background, thin black rules. No decorative chrome.
 */
export function ClassicATSProfessionalTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const professionalTitle = resumeData.experience?.[0]?.position?.trim() || "";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[11pt] font-bold uppercase tracking-wide text-black border-b border-black pb-[2px] mb-2 mt-4"
      style={{ fontFamily: "Arial, Calibri, sans-serif" }}
    >
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
      className="bg-white text-black p-10 pb-14 text-[11pt] leading-[1.45] max-w-[800px] mx-auto"
      style={{ fontFamily: "Arial, Calibri, 'Helvetica Neue', sans-serif", color: "#000" }}
    >
      <header className="mb-4 text-center">
        <h1 className="text-[18pt] font-bold tracking-tight text-black mb-1">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {professionalTitle ? (
          <p className="text-[11pt] text-[#333] mb-2">{professionalTitle}</p>
        ) : null}
        {contactParts.length > 0 && (
          <p className="text-[10pt] text-[#333] leading-relaxed">
            {contactParts.join("  |  ")}
          </p>
        )}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[10.5pt] text-black">{resumeData.summary}</p>
        </section>
      ) : null}

      {(technical.length > 0 || soft.length > 0 || languages.length > 0) && (
        <section>
          <SectionHeading>Technical Skills</SectionHeading>
          <div className="space-y-1 text-[10.5pt]">
            {technical.length > 0 && (
              <p>
                <span className="font-bold">Technical: </span>
                {technical.join(", ")}
              </p>
            )}
            {soft.length > 0 && (
              <p>
                <span className="font-bold">Soft Skills: </span>
                {soft.join(", ")}
              </p>
            )}
            {languages.length > 0 && (
              <p>
                <span className="font-bold">Languages: </span>
                {languages.join(", ")}
              </p>
            )}
          </div>
        </section>
      )}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Work Experience</SectionHeading>
          <div className="space-y-3">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">
                    {exp.position || "Position"}
                    {exp.company ? `, ${exp.company}` : ""}
                  </h3>
                  <span className="text-[10pt] text-[#444] whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                {exp.location ? (
                  <p className="text-[10pt] text-[#444] italic">{exp.location}</p>
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
          <SectionHeading>Projects</SectionHeading>
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
                {(project.link || project.github) && (
                  <p className="text-[10pt] text-[#333]">
                    {[project.link, project.github].filter(Boolean).join("  |  ")}
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
                    {edu.institution ? ` — ${edu.institution}` : ""}
                  </h3>
                  <span className="text-[10pt] text-[#444] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                {(edu.location || edu.gpa) && (
                  <p className="text-[10pt] text-[#444]">
                    {[edu.location, edu.gpa ? `GPA: ${edu.gpa}` : ""]
                      .filter(Boolean)
                      .join("  |  ")}
                  </p>
                )}
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
                {cert.date ? ` (${formatDateRange(cert.date, "", false) || cert.date})` : ""}
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
