"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const CREAM = "#f7f3eb";
const INK = "#111111";

/** Premium — Modern Luxury. ID: modern_luxury */
export function ModernLuxuryTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[9.5pt] font-semibold uppercase tracking-[0.28em] text-[#111] mb-3 mt-6"
      style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
    >
      {children}
      <span className="block mt-2 h-px w-12 bg-[#111]" />
    </h2>
  );

  return (
    <div
      className="max-w-[800px] mx-auto text-[10.5pt] leading-[1.55] text-[#1c1917]"
      style={{ backgroundColor: CREAM, fontFamily: "'Times New Roman', Georgia, serif" }}
    >
      <header className="px-12 pt-12 pb-8">
        <h1
          className="text-[26pt] font-normal tracking-tight leading-none"
          style={{ color: INK }}
        >
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {resumeData.experience?.[0]?.position ? (
          <p
            className="mt-3 text-[11pt] tracking-[0.08em] uppercase text-[#444]"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {resumeData.experience[0].position}
          </p>
        ) : null}
        {contacts.length > 0 && (
          <p
            className="mt-4 text-[9.5pt] text-[#555]"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {contacts.join("   ·   ")}
          </p>
        )}
      </header>

      <div className="px-12 pb-12">
        {resumeData.summary ? (
          <section>
            <Section>Summary</Section>
            <p
              className="text-[11pt] text-[#333] max-w-[620px]"
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
                    <h3 className="text-[12pt] font-semibold">{exp.position || "Role"}</h3>
                    <span
                      className="text-[9.5pt] text-[#666] whitespace-nowrap"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p
                    className="text-[10pt] text-[#555] mt-0.5"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {[exp.company, exp.location].filter(Boolean).join(", ")}
                  </p>
                  {filterEmpty(exp.description).length > 0 && (
                    <ul
                      className="mt-2 space-y-1 text-[10.5pt]"
                      style={{ fontFamily: "Arial, sans-serif", listStyle: "none", paddingLeft: 0 }}
                    >
                      {filterEmpty(exp.description).map((d, i) => (
                        <li key={i} className="pl-3 border-l border-[#ccc]">
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
            <Section>Expertise</Section>
            <p style={{ fontFamily: "Arial, sans-serif" }}>
              {[...technical, ...soft].join("  ·  ")}
            </p>
            {languages.length > 0 && (
              <p className="mt-1" style={{ fontFamily: "Arial, sans-serif" }}>
                Languages: {languages.join(", ")}
              </p>
            )}
          </section>
        )}

        {resumeData.projects?.length > 0 && (
          <section>
            <Section>Selected Work</Section>
            <div className="space-y-3">
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="font-semibold text-[11pt]">{project.name}</h3>
                  {project.description ? (
                    <p style={{ fontFamily: "Arial, sans-serif" }}>{project.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.education?.length > 0 && (
          <section>
            <Section>Education</Section>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index} className="mb-2 flex justify-between gap-3">
                <div>
                  <h3 className="font-semibold">
                    {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  </h3>
                  <p style={{ fontFamily: "Arial, sans-serif" }}>{edu.institution}</p>
                </div>
                <span
                  className="text-[9.5pt] text-[#666] whitespace-nowrap"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                </span>
              </div>
            ))}
          </section>
        )}

        {resumeData.certifications?.length > 0 && (
          <section>
            <Section>Credentials</Section>
            <ul className="space-y-1" style={{ fontFamily: "Arial, sans-serif", listStyle: "none" }}>
              {resumeData.certifications.map((cert, i) => (
                <li key={cert.id || i}>
                  {cert.name}
                  {cert.issuer ? `, ${cert.issuer}` : ""}
                  {cert.date ? ` — ${cert.date}` : ""}
                </li>
              ))}
            </ul>
          </section>
        )}

        {achievements.length > 0 && (
          <section>
            <Section>Highlights</Section>
            <ul
              className="space-y-1"
              style={{ fontFamily: "Arial, sans-serif", listStyle: "none", paddingLeft: 0 }}
            >
              {achievements.map((item, i) => (
                <li key={i} className="pl-3 border-l border-[#ccc]">
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
