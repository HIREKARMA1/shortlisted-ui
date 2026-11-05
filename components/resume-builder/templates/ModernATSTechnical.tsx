"use client";

import type { ReactNode } from "react";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

const LANGUAGE_HINTS = [
  "java",
  "python",
  "javascript",
  "typescript",
  "c++",
  "c#",
  "golang",
  "go",
  "rust",
  "kotlin",
  "swift",
  "ruby",
  "php",
  "scala",
  "r",
  "sql",
  "bash",
  "shell",
];
const FRONTEND_HINTS = [
  "react",
  "next",
  "angular",
  "vue",
  "html",
  "css",
  "sass",
  "tailwind",
  "redux",
  "jquery",
];
const BACKEND_HINTS = [
  "fastapi",
  "django",
  "flask",
  "spring",
  "node",
  "express",
  "nestjs",
  "dotnet",
  ".net",
  "rails",
  "laravel",
  "graphql",
  "rest",
];
const DATABASE_HINTS = [
  "postgres",
  "mysql",
  "mongodb",
  "redis",
  "sqlite",
  "oracle",
  "dynamodb",
  "cassandra",
  "elasticsearch",
];
const TOOL_HINTS = [
  "git",
  "docker",
  "kubernetes",
  "k8s",
  "jenkins",
  "postman",
  "selenium",
  "cypress",
  "aws",
  "azure",
  "gcp",
  "linux",
  "jira",
  "figma",
  "terraform",
  "ci/cd",
];

function matchesAny(skill: string, hints: string[]): boolean {
  const lower = skill.toLowerCase();
  return hints.some((hint) => lower.includes(hint));
}

function categorizeTechnical(skills: string[]) {
  const buckets = {
    programming: [] as string[],
    frontend: [] as string[],
    backend: [] as string[],
    databases: [] as string[],
    tools: [] as string[],
    other: [] as string[],
  };

  for (const skill of skills) {
    if (matchesAny(skill, LANGUAGE_HINTS)) buckets.programming.push(skill);
    else if (matchesAny(skill, FRONTEND_HINTS)) buckets.frontend.push(skill);
    else if (matchesAny(skill, BACKEND_HINTS)) buckets.backend.push(skill);
    else if (matchesAny(skill, DATABASE_HINTS)) buckets.databases.push(skill);
    else if (matchesAny(skill, TOOL_HINTS)) buckets.tools.push(skill);
    else buckets.other.push(skill);
  }

  return buckets;
}

/**
 * Modern ATS Technical — developer-focused single-column resume.
 * Categorized skills as plain text. No sidebars, bars, or icons.
 */
export function ModernATSTechnicalTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const skillBuckets = categorizeTechnical(technical);
  const achievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const jobTitle = resumeData.experience?.[0]?.position?.trim() || "";

  const SectionHeading = ({ children }: { children: ReactNode }) => (
    <h2 className="text-[11pt] font-bold uppercase tracking-[0.08em] text-black border-b border-[#222] pb-[3px] mb-2.5 mt-4">
      {children}
    </h2>
  );

  const SkillRow = ({ label, items }: { label: string; items: string[] }) => {
    if (!items.length) return null;
    return (
      <p className="text-[10.5pt] leading-relaxed">
        <span className="font-bold text-black">{label}: </span>
        <span className="text-[#222]">{items.join(", ")}</span>
      </p>
    );
  };

  const contactLine = [
    resumeData.header?.phone,
    resumeData.header?.email,
    resumeData.header?.location,
  ]
    .filter(Boolean)
    .join("  ·  ");

  const linksLine = [
    resumeData.header?.linkedin ? `LinkedIn: ${resumeData.header.linkedin}` : "",
    resumeData.header?.website ? `GitHub / Portfolio: ${resumeData.header.website}` : "",
  ]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div
      className="bg-white text-black p-10 pb-14 text-[11pt] leading-[1.45] max-w-[800px] mx-auto"
      style={{ fontFamily: "Calibri, Arial, 'Segoe UI', sans-serif", color: "#111" }}
    >
      <header className="mb-4 pb-3 border-b border-[#111]">
        <h1 className="text-[20pt] font-bold tracking-tight text-black leading-tight">
          {resumeData.header?.fullName || "Your Name"}
        </h1>
        {jobTitle ? (
          <p className="text-[11pt] text-[#333] mt-1 font-medium">{jobTitle}</p>
        ) : null}
        {contactLine ? (
          <p className="text-[10pt] text-[#444] mt-2">{contactLine}</p>
        ) : null}
        {linksLine ? (
          <p className="text-[10pt] text-[#444] mt-0.5 break-all">{linksLine}</p>
        ) : null}
      </header>

      {(technical.length > 0 || soft.length > 0 || languages.length > 0) && (
        <section>
          <SectionHeading>Technical Skills</SectionHeading>
          <div className="space-y-1">
            <SkillRow label="Programming Languages" items={skillBuckets.programming} />
            <SkillRow label="Frontend" items={skillBuckets.frontend} />
            <SkillRow label="Backend" items={skillBuckets.backend} />
            <SkillRow label="Databases" items={skillBuckets.databases} />
            <SkillRow label="Tools" items={skillBuckets.tools} />
            <SkillRow label="Additional Technical" items={skillBuckets.other} />
            <SkillRow label="Soft Skills" items={soft} />
            <SkillRow label="Languages" items={languages} />
          </div>
        </section>
      )}

      {resumeData.summary ? (
        <section>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[10.5pt] text-[#111]">{resumeData.summary}</p>
        </section>
      ) : null}

      {resumeData.experience?.length > 0 && (
        <section>
          <SectionHeading>Professional Experience</SectionHeading>
          <div className="space-y-3.5">
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt] text-black">
                    {exp.position || "Role"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                  </span>
                </div>
                <p className="text-[10.5pt] text-[#333]">
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

      {resumeData.projects?.length > 0 && (
        <section>
          <SectionHeading>Technical Projects</SectionHeading>
          <div className="space-y-3">
            {resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <div className="flex justify-between items-baseline gap-3">
                  <h3 className="font-bold text-[11pt]">{project.name || "Project"}</h3>
                  {(project.github || project.link) && (
                    <span className="text-[9.5pt] text-[#555] truncate max-w-[45%]">
                      {project.github || project.link}
                    </span>
                  )}
                </div>
                {project.description ? (
                  <p className="text-[10.5pt] mt-0.5">{project.description}</p>
                ) : null}
                {filterEmpty(project.technologies).length > 0 && (
                  <p className="text-[10pt] text-[#333] mt-0.5">
                    <span className="font-bold">Tech Stack: </span>
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
                    {edu.institution || "Institution"}
                  </h3>
                  <span className="text-[10pt] text-[#555] whitespace-nowrap">
                    {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                  </span>
                </div>
                <p className="text-[10.5pt] text-[#333]">
                  {[edu.degree, edu.field].filter(Boolean).join(" in ")}
                  {edu.gpa ? ` · GPA ${edu.gpa}` : ""}
                  {edu.location ? ` · ${edu.location}` : ""}
                </p>
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
                {cert.issuer ? `, ${cert.issuer}` : ""}
                {cert.date ? ` — ${cert.date}` : ""}
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
