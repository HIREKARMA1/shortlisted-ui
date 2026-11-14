"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const TERRACOTTA = "#c2410c";
const INK = "#1c1917";

/** Premium — Creative Portfolio. ID: creative_portfolio */
export function CreativePortfolioTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);

  const Section = ({ children }: { children: ReactNode }) => (
    <h2 className="flex items-center gap-3 text-[11pt] font-bold mb-3 mt-5" style={{ color: INK }}>
      <span
        className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
        style={{ backgroundColor: TERRACOTTA }}
      />
      <span className="tracking-wide">{children}</span>
    </h2>
  );

  return (
    <div
      className="bg-white max-w-[800px] mx-auto text-[10.5pt] leading-[1.48] text-[#1c1917]"
      style={{ fontFamily: "'Trebuchet MS', 'Segoe UI', Arial, sans-serif" }}
    >
      <header className="px-9 pt-9 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 border-b-4 pb-4" style={{ borderColor: TERRACOTTA }}>
          <div>
            <h1 className="text-[24pt] font-extrabold tracking-tight leading-none" style={{ color: INK }}>
              {resumeData.header?.fullName || "Your Name"}
            </h1>
            {resumeData.experience?.[0]?.position ? (
              <p className="mt-2 text-[11pt] font-medium" style={{ color: TERRACOTTA }}>
                {resumeData.experience[0].position}
              </p>
            ) : null}
          </div>
          {contacts.length > 0 && (
            <p className="text-[9.5pt] text-[#57534e] sm:text-right max-w-sm">
              {contacts.join(" · ")}
            </p>
          )}
        </div>
      </header>

      <div className="px-9 pb-10">
        {resumeData.summary ? (
          <section>
            <Section>About</Section>
            <p className="text-[#44403c]">{resumeData.summary}</p>
          </section>
        ) : null}

        {resumeData.projects?.length > 0 && (
          <section>
            <Section>Portfolio & Projects</Section>
            <div className="grid grid-cols-1 gap-3">
              {resumeData.projects.map((project, index) => (
                <div
                  key={project.id || index}
                  className="pl-3 border-l-2"
                  style={{ borderColor: TERRACOTTA }}
                >
                  <h3 className="font-bold text-[11pt]">{project.name || "Project"}</h3>
                  {project.description ? (
                    <p className="mt-0.5 text-[#44403c]">{project.description}</p>
                  ) : null}
                  {filterEmpty(project.technologies).length > 0 && (
                    <p className="text-[9.5pt] mt-1 text-[#78716c]">
                      {filterEmpty(project.technologies).join(" · ")}
                    </p>
                  )}
                  {(project.link || project.github) && (
                    <p className="text-[9.5pt] mt-0.5 break-all" style={{ color: TERRACOTTA }}>
                      {[project.link, project.github].filter(Boolean).join("  |  ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.experience?.length > 0 && (
          <section>
            <Section>Experience</Section>
            <div className="space-y-3.5">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <h3 className="font-bold">
                      {exp.position}
                      {exp.company ? ` @ ${exp.company}` : ""}
                    </h3>
                    <span className="text-[9.5pt] text-[#78716c] whitespace-nowrap">
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
            <Section>Skills</Section>
            <p>{[...technical, ...soft].join("  ·  ")}</p>
            {languages.length > 0 && (
              <p className="mt-1 text-[#57534e]">Languages: {languages.join(", ")}</p>
            )}
          </section>
        )}

        {resumeData.education?.length > 0 && (
          <section>
            <Section>Education</Section>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-2 flex justify-between gap-2">
                <div>
                  <h3 className="font-bold">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </h3>
                  <p className="text-[#57534e]">{edu.institution}</p>
                </div>
                <span className="text-[9.5pt] text-[#78716c] whitespace-nowrap">
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
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
                  {cert.name}
                  {cert.issuer ? ` — ${cert.issuer}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {achievements.length > 0 && (
          <section>
            <Section>Recognition</Section>
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
