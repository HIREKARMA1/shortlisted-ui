"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";
import { collectAchievements, skillLists } from "./shared/premiumHelpers";

const CHARCOAL = "#1f2937";
const TEAL = "#0d9488";
const SIDEBAR = "#111827";

/** Premium — Tech Innovator. ID: tech_innovator */
export function TechInnovatorTemplate({ resumeData }: ResumeTemplateProps) {
  const { technical, soft, languages } = skillLists(resumeData);
  const achievements = collectAchievements(resumeData);

  const SideHeading = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[9pt] font-bold uppercase tracking-[0.16em] mb-2 pb-1"
      style={{ color: TEAL, borderBottom: "1px solid rgba(13,148,136,0.35)" }}
    >
      {children}
    </h2>
  );

  const MainHeading = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[10.5pt] font-bold uppercase tracking-[0.12em] mb-2.5 mt-1 pb-1"
      style={{ color: CHARCOAL, borderBottom: `2px solid ${TEAL}` }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white text-[#1f2937] max-w-[800px] mx-auto text-[10.5pt] leading-[1.45]"
      style={{ fontFamily: "'Segoe UI', Calibri, Arial, sans-serif" }}
    >
      <div className="flex min-h-[1000px]">
        <aside className="w-[30%] text-white p-6 space-y-5" style={{ backgroundColor: SIDEBAR }}>
          <div>
            <h1 className="text-[14pt] font-bold leading-tight text-white">
              {resumeData.header?.fullName || "Your Name"}
            </h1>
            {resumeData.experience?.[0]?.position ? (
              <p className="text-[9.5pt] mt-1.5" style={{ color: TEAL }}>
                {resumeData.experience[0].position}
              </p>
            ) : null}
          </div>

          <section>
            <SideHeading>Contact</SideHeading>
            <ul className="space-y-1.5 text-[9pt] text-white/85 break-all">
              {resumeData.header?.email && <li>{resumeData.header.email}</li>}
              {resumeData.header?.phone && <li>{resumeData.header.phone}</li>}
              {resumeData.header?.location && <li>{resumeData.header.location}</li>}
              {resumeData.header?.linkedin && (
                <li>
                  <a href={resumeData.header.linkedin} style={{ color: "#5eead4" }}>
                    LinkedIn
                  </a>
                </li>
              )}
              {resumeData.header?.website && (
                <li>
                  <a href={resumeData.header.website} style={{ color: "#5eead4" }}>
                    GitHub / Portfolio
                  </a>
                </li>
              )}
            </ul>
          </section>

          {technical.length > 0 && (
            <section>
              <SideHeading>Technical Skills</SideHeading>
              <ul className="space-y-1 text-[9pt] text-white/90">
                {technical.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {soft.length > 0 && (
            <section>
              <SideHeading>Soft Skills</SideHeading>
              <p className="text-[9pt] text-white/85">{soft.join(", ")}</p>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <SideHeading>Languages</SideHeading>
              <p className="text-[9pt] text-white/85">{languages.join(", ")}</p>
            </section>
          )}

          {resumeData.certifications?.length > 0 && (
            <section>
              <SideHeading>Certifications</SideHeading>
              <ul className="space-y-1.5 text-[9pt] text-white/85">
                {resumeData.certifications.map((cert, i) => (
                  <li key={cert.id || i}>
                    {cert.name}
                    {cert.issuer ? ` — ${cert.issuer}` : ""}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="w-[70%] p-7 space-y-4">
          {resumeData.summary ? (
            <section>
              <MainHeading>Professional Summary</MainHeading>
              <p className="text-[#334155]">{resumeData.summary}</p>
            </section>
          ) : null}

          {resumeData.experience?.length > 0 && (
            <section>
              <MainHeading>Experience</MainHeading>
              <div className="space-y-3.5">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id || index}>
                    <div className="flex justify-between gap-2 items-baseline">
                      <h3 className="font-bold text-[11pt]" style={{ color: CHARCOAL }}>
                        {exp.position || "Engineer"}
                      </h3>
                      <span className="text-[9pt] text-[#64748b] whitespace-nowrap">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    <p className="text-[10pt] font-medium" style={{ color: TEAL }}>
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

          {resumeData.projects?.length > 0 && (
            <section>
              <MainHeading>Projects</MainHeading>
              <div className="space-y-3">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id || index}>
                    <h3 className="font-bold">{project.name || "Project"}</h3>
                    {project.description ? (
                      <p className="mt-0.5 text-[#334155]">{project.description}</p>
                    ) : null}
                    {filterEmpty(project.technologies).length > 0 && (
                      <p className="text-[9.5pt] mt-0.5 text-[#475569]">
                        <span className="font-bold">Stack: </span>
                        {filterEmpty(project.technologies).join(", ")}
                      </p>
                    )}
                    {(project.github || project.link) && (
                      <p className="text-[9.5pt] break-all" style={{ color: TEAL }}>
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
              <MainHeading>Education</MainHeading>
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index} className="mb-2 flex justify-between gap-2">
                  <div>
                    <h3 className="font-bold">
                      {[edu.degree, edu.field].filter(Boolean).join(" in ") || "Degree"}
                    </h3>
                    <p className="text-[#475569]">{edu.institution}</p>
                  </div>
                  <span className="text-[9pt] text-[#64748b] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
              ))}
            </section>
          )}

          {achievements.length > 0 && (
            <section>
              <MainHeading>Achievements</MainHeading>
              <ul className="list-disc list-outside ml-5 space-y-0.5">
                {achievements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
