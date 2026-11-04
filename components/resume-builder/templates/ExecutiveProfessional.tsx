"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

const NAVY = "#0f172a";
const NAVY_LIGHT = "#1e293b";
const SLATE = "#64748b";

export function ExecutiveProfessionalTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const allAchievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const professionalTitle =
    resumeData.experience?.[0]?.position?.trim() || "";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <div className="mb-4">
      <h2
        className="text-xs font-semibold uppercase tracking-[0.2em] pb-2 border-b"
        style={{ color: NAVY, borderColor: "#e2e8f0" }}
      >
        {children}
      </h2>
    </div>
  );

  const ContactItem = ({
    label,
    value,
    href,
  }: {
    label: string;
    value: string;
    href?: string;
  }) => (
    <div className="text-xs">
      <span className="uppercase tracking-wide text-white/60">{label}</span>
      <div className="text-white/95 mt-0.5 break-all">
        {href ? (
          <a href={href} className="hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );

  return (
    <div
      className="bg-white text-gray-800 text-sm leading-relaxed max-w-[800px] mx-auto print:shadow-none"
      style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" }}
    >
      <header
        className="px-10 pt-9 pb-8"
        style={{ backgroundColor: NAVY, color: "#fff" }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {professionalTitle && (
          <p
            className="text-base font-medium mb-5"
            style={{ color: "#94a3b8" }}
          >
            {professionalTitle}
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pt-4 border-t border-white/15">
          {resumeData.header?.email && (
            <ContactItem label="Email" value={resumeData.header.email} />
          )}
          {resumeData.header?.phone && (
            <ContactItem label="Phone" value={resumeData.header.phone} />
          )}
          {resumeData.header?.location && (
            <ContactItem label="Location" value={resumeData.header.location} />
          )}
          {resumeData.header?.linkedin && (
            <ContactItem
              label="LinkedIn"
              value="Profile"
              href={resumeData.header.linkedin}
            />
          )}
          {resumeData.header?.website && (
            <ContactItem
              label="Portfolio"
              value={
                resumeData.header.website.replace(/^https?:\/\//, "").split("/")[0]
              }
              href={resumeData.header.website}
            />
          )}
        </div>
      </header>

      <div className="px-10 py-8 space-y-8">
        {resumeData.summary && (
          <section>
            <SectionHeading>Professional Summary</SectionHeading>
            <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
          </section>
        )}

        {(technical.length > 0 || soft.length > 0 || languages.length > 0) && (
          <section>
            <SectionHeading>Technical Skills</SectionHeading>
            <div className="space-y-3">
              {technical.length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: NAVY_LIGHT }}
                  >
                    Technical
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {technical.join("  ·  ")}
                  </p>
                </div>
              )}
              {soft.length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: NAVY_LIGHT }}
                  >
                    Soft Skills
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {soft.join("  ·  ")}
                  </p>
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-2"
                    style={{ color: NAVY_LIGHT }}
                  >
                    Languages
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {languages.join("  ·  ")}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {resumeData.experience?.length > 0 && (
          <section>
            <SectionHeading>Work Experience</SectionHeading>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div
                  key={exp.id || index}
                  className="pb-5 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <div>
                      <h3
                        className="font-bold text-base"
                        style={{ color: NAVY }}
                      >
                        {exp.position}
                      </h3>
                      <p className="text-sm font-medium" style={{ color: SLATE }}>
                        {exp.company}
                        {exp.location && ` · ${exp.location}`}
                      </p>
                    </div>
                    <span
                      className="text-xs whitespace-nowrap shrink-0 pt-1"
                      style={{ color: SLATE }}
                    >
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  </div>
                  {filterEmpty(exp.description).length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-2 text-gray-700 space-y-1 text-xs">
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
            <div className="space-y-5">
              {resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold" style={{ color: NAVY }}>
                      {project.name}
                    </h3>
                    {(project.link || project.github) && (
                      <a
                        href={project.link || project.github}
                        className="text-xs shrink-0"
                        style={{ color: NAVY_LIGHT }}
                      >
                        Link
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  {filterEmpty(project.technologies).length > 0 && (
                    <p className="text-xs mt-2" style={{ color: SLATE }}>
                      <span className="font-semibold text-gray-600">
                        Technologies:{" "}
                      </span>
                      {project.technologies.join(", ")}
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
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold" style={{ color: NAVY }}>
                        {edu.degree}
                        {edu.field && `, ${edu.field}`}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {edu.institution}
                        {edu.location && ` · ${edu.location}`}
                      </p>
                      {edu.gpa && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: SLATE }}>
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {resumeData.certifications?.length > 0 && (
          <section>
            <SectionHeading>Certifications</SectionHeading>
            <ul className="space-y-3">
              {resumeData.certifications.map((cert, index) => (
                <li key={cert.id || index} className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{cert.name}</p>
                    {cert.issuer && (
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                    )}
                  </div>
                  {cert.date && (
                    <span className="text-xs shrink-0" style={{ color: SLATE }}>
                      {cert.date}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {allAchievements.length > 0 && (
          <section>
            <SectionHeading>Achievements</SectionHeading>
            <ul className="list-disc list-outside ml-4 text-gray-700 space-y-1 text-xs">
              {allAchievements.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
