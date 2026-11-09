"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

/**
 * Harvard Professional — traditional academic/corporate ATS resume.
 * Identifier: harvard_professional / harvard-professional
 */
export function HarvardProfessionalTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const skills = [...technical, ...soft];
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  // Map projects as publications/activities when present (compatible existing field)
  const activities = resumeData.projects || [];

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2
      className="text-[11pt] font-bold uppercase text-black mb-2 mt-4"
      style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
    >
      {children}
    </h2>
  );

  const contactParts = [
    resumeData.header?.location,
    resumeData.header?.phone,
    resumeData.header?.email,
    resumeData.header?.linkedin,
    resumeData.header?.website,
  ].filter(Boolean);

  return (
    <div
      className="bg-white text-black p-11 pb-14 text-[11pt] leading-[1.4] max-w-[800px] mx-auto"
      style={{
        fontFamily: "Georgia, 'Times New Roman', Times, serif",
        color: "#000",
      }}
    >
      <header className="mb-4 text-center border-b border-black pb-3">
        <h1 className="text-[18pt] font-bold uppercase tracking-wider text-black mb-2">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {contactParts.length > 0 && (
          <p
            className="text-[10pt] text-[#333]"
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
            className="text-[10.5pt] text-black text-justify"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {resumeData.summary}
          </p>
        </section>
      ) : null}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-3">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-bold text-[11pt]">
                    {exp.company || "Organization"}
                    {exp.location ? `, ${exp.location}` : ""}
                  </h3>
                  <span
                    className="text-[10pt] text-[#333] whitespace-nowrap"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p
                  className="text-[10.5pt] italic text-[#222]"
                  style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                >
                  {exp.position || "Role"}
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

      {resumeData.education?.length > 0 && (
        <section>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-2">
            {resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-bold text-[11pt]">
                    {edu.institution || "Institution"}
                    {edu.location ? `, ${edu.location}` : ""}
                  </h3>
                  <span
                    className="text-[10pt] text-[#333] whitespace-nowrap"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p
                  className="text-[10.5pt] italic"
                  style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                >
                  {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  {edu.gpa ? `; GPA: ${edu.gpa}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section>
          <SectionHeading>Skills</SectionHeading>
          <p
            className="text-[10.5pt]"
            style={{ fontFamily: "Arial, Calibri, sans-serif" }}
          >
            {skills.join("; ")}
            {languages.length > 0 ? `; Languages: ${languages.join(", ")}` : ""}
          </p>
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
                {cert.issuer ? `, ${cert.issuer}` : ""}
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

      {activities.length > 0 && (
        <section>
          <SectionHeading>Publications & Relevant Activities</SectionHeading>
          <div className="space-y-2">
            {activities.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-[11pt]">{project.name || "Activity"}</h3>
                {project.description ? (
                  <p
                    className="text-[10.5pt] mt-0.5"
                    style={{ fontFamily: "Arial, Calibri, sans-serif" }}
                  >
                    {project.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
