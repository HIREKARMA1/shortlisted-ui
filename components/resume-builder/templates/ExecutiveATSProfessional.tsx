"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

/**
 * Executive ATS Professional — senior/corporate single-column resume.
 * Black typography, minimal dark-grey rules. No gold, gradients, or sidebars.
 */
export function ExecutiveATSProfessionalTemplate({
  resumeData,
}: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const competencies = [...technical, ...soft];
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const seniorTitle = resumeData.experience?.[0]?.position?.trim() || "";

  // Split experience bullets: first half as responsibilities, rest as achievements
  // when there are enough bullets; otherwise keep a single list under experience.
  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[10.5pt] font-bold uppercase tracking-[0.14em] text-black border-b border-[#222] pb-[3px] mb-2.5 mt-5">
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
      className="bg-white text-black p-11 pb-14 text-[11pt] leading-[1.5] max-w-[800px] mx-auto"
      style={{
        fontFamily: "Georgia, 'Times New Roman', Times, serif",
        color: "#111",
      }}
    >
      <header className="mb-5 text-left border-b-2 border-black pb-3">
        <h1
          className="text-[22pt] font-bold tracking-tight text-black leading-none mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {seniorTitle ? (
          <p className="text-[11pt] text-[#333] font-medium mb-2 uppercase tracking-wide">
            {seniorTitle}
          </p>
        ) : null}
        {contactParts.length > 0 && (
          <p
            className="text-[10pt] text-[#444]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {contactParts.join("  |  ")}
          </p>
        )}
        {resumeData.header?.website ? (
          <p
            className="text-[10pt] text-[#444] mt-0.5"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {resumeData.header.website}
          </p>
        ) : null}
      </header>

      {resumeData.summary ? (
        <section>
          <SectionHeading>Executive Summary</SectionHeading>
          <p
            className="text-[10.5pt] text-[#111]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {resumeData.summary}
          </p>
        </section>
      ) : null}

      {(competencies.length > 0 || languages.length > 0) && (
        <section>
          <SectionHeading>Core Competencies</SectionHeading>
          <p
            className="text-[10.5pt] text-[#222]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {[...competencies, ...languages.map((l) => `Languages: ${l}`)].join(
              "  ·  "
            )}
          </p>
        </section>
      )}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => {
              const bullets = filterEmpty(exp.description);
              const splitAt =
                bullets.length >= 4 ? Math.ceil(bullets.length / 2) : bullets.length;
              const responsibilities = bullets.slice(0, splitAt);
              const roleAchievements =
                bullets.length >= 4 ? bullets.slice(splitAt) : [];

              return (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-baseline gap-3">
                    <h3 className="font-bold text-[12pt] text-black">
                      {exp.position || "Role"}
                    </h3>
                    <span
                      className="text-[10pt] text-[#555] whitespace-nowrap"
                      style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p
                    className="text-[10.5pt] text-[#333] italic mb-1"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {[exp.company, exp.location].filter(Boolean).join(" — ")}
                  </p>
                  {responsibilities.length > 0 && (
                    <div style={{ fontFamily: "Arial, Calibri, sans-serif" }}>
                      {roleAchievements.length > 0 && (
                        <p className="text-[9.5pt] font-bold uppercase tracking-wide text-[#444] mb-0.5">
                          Responsibilities
                        </p>
                      )}
                      <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]">
                        {responsibilities.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {roleAchievements.length > 0 && (
                    <div
                      className="mt-1.5"
                      style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                    >
                      <p className="text-[9.5pt] font-bold uppercase tracking-wide text-[#444] mb-0.5">
                        Key Achievements
                      </p>
                      <ul className="list-disc list-outside ml-5 space-y-0.5 text-[10.5pt]">
                        {roleAchievements.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {resumeData.projects?.length > 0 && (
        <section>
          <SectionHeading>Selected Projects / Initiatives</SectionHeading>
          <div className="space-y-3">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Initiative"}</h3>
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
                    <span className="font-bold">Focus Areas: </span>
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
                    {[edu.degree, edu.field].filter(Boolean).join(" in ") ||
                      "Degree"}
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
                  {[edu.institution, edu.location, edu.gpa ? `GPA ${edu.gpa}` : ""]
                    .filter(Boolean)
                    .join("  ·  ")}
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
          <SectionHeading>Key Achievements</SectionHeading>
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
