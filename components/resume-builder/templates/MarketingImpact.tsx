"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import {
  collectAchievements,
  contactParts,
  skillLists,
} from "./shared/premiumHelpers";

const BURGUNDY = "#9f1239";
const DEEP = "#4c0519";

/** Premium — Marketing Impact. ID: marketing_impact */
export function MarketingImpactTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);
  const contacts = contactParts(resumeData);
  const projects = resumeData.projects || [];

  const Section = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[11pt] font-extrabold uppercase tracking-[0.08em] mb-2.5 mt-5"
      style={{ color: DEEP }}
    >
      <span style={{ borderBottom: `3px solid ${BURGUNDY}`, paddingBottom: 2 }}>
        {children}
      </span>
    </h2>
  );

  return (
    <div
      className="bg-white max-w-[800px] mx-auto text-[10.5pt] leading-[1.44] text-[#1c1917]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <header
        className="px-9 pt-8 pb-6 text-white"
        style={{ backgroundColor: DEEP }}
      >
        <h1 className="text-[22pt] font-extrabold tracking-tight leading-none">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {resumeData.experience?.[0]?.position ? (
          <p className="mt-2 text-[11pt] font-semibold" style={{ color: "#fda4af" }}>
            {resumeData.experience[0].position}
          </p>
        ) : null}
        {contacts.length > 0 && (
          <p className="mt-3 text-[9.5pt] text-white/80">{contacts.join("  ·  ")}</p>
        )}
      </header>

      <div className="px-9 py-6 pb-10">
        {resumeData.summary ? (
          <section>
            <Section>Professional Summary</Section>
            <p>{resumeData.summary}</p>
          </section>
        ) : null}

        {(achievements.length > 0 || soft.length > 0) && (
          <section>
            <Section>Impact Highlights</Section>
            {achievements.length > 0 ? (
              <ul className="list-disc list-outside ml-5 space-y-1">
                {achievements.map((item, i) => (
                  <li key={i}>
                    <span className="font-semibold">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{soft.join(" · ")}</p>
            )}
          </section>
        )}

        {resumeData.experience?.length > 0 && (
          <section>
            <Section>Professional Experience</Section>
            <div className="space-y-3.5">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between gap-2 items-baseline">
                    <h3 className="font-bold text-[11pt]" style={{ color: DEEP }}>
                      {exp.position || "Role"}
                    </h3>
                    <span className="text-[9.5pt] text-[#78716c] whitespace-nowrap">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="font-semibold" style={{ color: BURGUNDY }}>
                    {[exp.company, exp.location].filter(Boolean).join(" · ")}
                  </p>
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

        {projects.length > 0 && (
          <section>
            <Section>Campaigns & Initiatives</Section>
            <div className="space-y-2.5">
              {projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="font-bold">{project.name || "Campaign"}</h3>
                  {project.description ? <p>{project.description}</p> : null}
                  {filterEmpty(project.technologies).length > 0 && (
                    <p className="text-[9.5pt] text-[#57534e]">
                      Channels: {filterEmpty(project.technologies).join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(technical.length > 0 || soft.length > 0) && (
          <section>
            <Section>Core Competencies</Section>
            <p>{[...soft, ...technical].join("  ·  ")}</p>
            {languages.length > 0 && (
              <p className="mt-1">Languages: {languages.join(", ")}</p>
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
      </div>
    </div>
  );
}
