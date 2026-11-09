"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

/** Premium — Monochrome Prestige. ID: monochrome_prestige */
export function MonochromePrestigeTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[9pt] font-bold uppercase tracking-[0.32em] text-black mb-4 mt-8"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white max-w-[800px] mx-auto text-[10.5pt] leading-[1.6] text-black"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      <header className="px-14 pt-14 pb-8 text-center">
        <h1 className="text-[28pt] font-normal tracking-[0.08em] uppercase leading-none">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        <div className="mx-auto my-5 h-px w-24 bg-black" />
        {contacts.length > 0 && (
          <p
            className="text-[9.5pt] text-[#333] tracking-wide"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {contacts.join("  |  ")}
          </p>
        )}
      </header>

      <div className="px-14 pb-14">
        {resumeData.summary ? (
          <section>
            <Section>Profile</Section>
            <p
              className="text-[11pt] text-center max-w-[560px] mx-auto text-[#222]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {resumeData.summary}
            </p>
          </section>
        ) : null}

        {resumeData.experience?.length > 0 && (
          <section>
            <Section>Experience</Section>
            <div className="space-y-5">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-4 items-baseline">
                    <h3 className="text-[12pt] font-bold tracking-wide">
                      {exp.position || "Role"}
                    </h3>
                    <span
                      className="text-[9.5pt] text-[#444] whitespace-nowrap"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p
                    className="text-[10.5pt] italic text-[#333] mt-0.5"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {[exp.company, exp.location].filter(Boolean).join(", ")}
                  </p>
                  {filterEmpty(exp.description).length > 0 && (
                    <ul
                      className="mt-2 space-y-1"
                      style={{ fontFamily: "Arial, sans-serif", listStyle: "none", paddingLeft: 0 }}
                    >
                      {filterEmpty(exp.description).map((d, i) => (
                        <li key={i} className="relative pl-4 before:content-['—'] before:absolute before:left-0 before:text-[#888]">
                          {d}
                        </li>
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
            <Section>Capabilities</Section>
            <p className="text-center" style={{ fontFamily: "Arial, sans-serif" }}>
              {[...technical, ...soft].join("   ·   ")}
            </p>
            {languages.length > 0 && (
              <p
                className="text-center mt-2 text-[#444]"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Languages: {languages.join(", ")}
              </p>
            )}
          </section>
        )}

        {resumeData.education?.length > 0 && (
          <section>
            <Section>Education</Section>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-3 text-center">
                <h3 className="font-bold text-[11pt]">
                  {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                </h3>
                <p style={{ fontFamily: "Arial, sans-serif" }}>
                  {edu.institution}
                  {" · "}
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </p>
              </div>
            ))}
          </section>
        )}

        {resumeData.projects?.length > 0 && (
          <section>
            <Section>Selected Projects</Section>
            <div className="space-y-3">
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index} className="text-center">
                  <h3 className="font-bold">{project.name}</h3>
                  {project.description ? (
                    <p style={{ fontFamily: "Arial, sans-serif" }}>{project.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.certifications?.length > 0 && (
          <section>
            <Section>Certifications</Section>
            <p className="text-center" style={{ fontFamily: "Arial, sans-serif" }}>
              {resumeData.certifications
                .map((c) => [c.name, c.issuer].filter(Boolean).join(" — "))
                .join("  ·  ")}
            </p>
          </section>
        )}

        {achievements.length > 0 && (
          <section>
            <Section>Distinctions</Section>
            <ul
              className="space-y-1 max-w-[560px] mx-auto"
              style={{ fontFamily: "Arial, sans-serif", listStyle: "none", paddingLeft: 0 }}
            >
              {achievements.map((item, i) => (
                <li key={i} className="text-center">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
