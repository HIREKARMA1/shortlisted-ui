"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

/**
 * Minimalist Classic — clean single-column ATS resume.
 * Identifier: minimalist_classic / minimalist-classic
 */
export function MinimalistClassicTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const allSkills = [...technical, ...soft];
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[10pt] font-semibold uppercase tracking-[0.12em] text-[#222] border-b border-[#ccc] pb-[3px] mb-2 mt-4"
      style={{ fontFamily: "Calibri, Arial, sans-serif" }}
    >
      {children}
    </h2>
  );

  const contactParts = [
    resumeData.header?.email,
    resumeData.header?.phone,
    resumeData.header?.location,
    resumeData.header?.linkedin,
    resumeData.header?.website,
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-[#222] p-10 pb-14 text-[10.5pt] leading-[1.5] max-w-[800px] mx-auto"
      style={{ fontFamily: "Calibri, Arial, 'Helvetica Neue', sans-serif", color: "#222" }}
    >
      <header className="mb-3">
        <h1 className="text-[16pt] font-semibold tracking-wide text-black mb-1.5">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {contactParts.length > 0 && (
          <p className="text-[9.5pt] text-[#555]">{contactParts.join(" · ")}</p>
        )}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[10.5pt] text-[#222]">{resumeData.summary}</p>
        </section>
      ) : null}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Work Experience</SectionHeading>
          <div className="space-y-3">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-semibold text-[10.5pt] text-black">
                    {exp.position || "Position"}
                  </h3>
                  <span className="text-[9.5pt] text-[#666] whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-[10pt] text-[#444]">
                  {[exp.company, exp.location].filter(Boolean).join(" — ")}
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

      {resumeData.education?.length > 0 && (
        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-2">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-semibold text-[10.5pt]">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                  </h3>
                  <span className="text-[9.5pt] text-[#666] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-[10pt] text-[#444]">
                  {[edu.institution, edu.location, edu.gpa ? `GPA ${edu.gpa}` : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {allSkills.length > 0 && (
        <section>
          <SectionHeading>Skills</SectionHeading>
          <p className="text-[10.5pt] text-[#222]">{allSkills.join(", ")}</p>
          {languages.length > 0 && (
            <p className="text-[10.5pt] text-[#222] mt-1">
              <span className="font-semibold">Languages: </span>
              {languages.join(", ")}
            </p>
          )}
        </section>
      )}

      {resumeData.projects?.length > 0 && (
        <section>
          <SectionHeading>Projects</SectionHeading>
          <div className="space-y-2.5">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-semibold text-[10.5pt]">{project.name || "Project"}</h3>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p className="text-[9.5pt] text-[#555] mt-0.5">
                    {filterEmpty(project.technologies).join(", ")}
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
                {cert.name}
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
