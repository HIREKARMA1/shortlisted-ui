"use client";

import { ProfilePhoto } from "./shared/ProfilePhoto";
import { ResumeTemplateProps } from "./shared/types";
import { filterEmpty, formatDateRange } from "./shared/utils";

const TEAL = "#0d9488";
const TEAL_DARK = "#0f766e";
const SIDEBAR = "#134e4a";

export function ModernCreativeTemplate({ resumeData }: ResumeTemplateProps) {
  const technical = filterEmpty(resumeData.skills?.technical);
  const soft = filterEmpty(resumeData.skills?.soft);
  const languages = filterEmpty(resumeData.skills?.languages);
  const allAchievements = (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
  const professionalTitle =
    resumeData.experience?.[0]?.position?.trim() || "";

  const SidebarHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 pb-1.5 border-b border-white/20"
      style={{ color: "#5eead4" }}
    >
      {children}
    </h2>
  );

  const MainHeading = ({ children }: { children: React.ReactNode }) => (
    <h2
      className="text-sm font-bold uppercase tracking-wide mb-4 pb-2 border-b-2"
      style={{ color: TEAL_DARK, borderColor: `${TEAL}55` }}
    >
      {children}
    </h2>
  );

  return (
    <div
      className="bg-white text-gray-800 text-sm leading-relaxed max-w-[800px] mx-auto print:shadow-none overflow-hidden"
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
    >
      <div className="flex min-h-[1050px]">
        <aside
          className="w-[34%] shrink-0 p-6 flex flex-col gap-6 text-white"
          style={{ backgroundColor: SIDEBAR }}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-[3px] flex items-center justify-center mb-3"
              style={{ borderColor: TEAL }}
            >
              <ProfilePhoto
                src={resumeData.header?.profilePhoto}
                className="w-full h-full object-cover"
                placeholderClassName="text-white/60 text-[10px]"
              />
            </div>
          </div>

          <section>
            <SidebarHeading>Contact</SidebarHeading>
            <ul className="space-y-2 text-xs text-white/90">
              {resumeData.header?.email && (
                <li className="break-all">{resumeData.header.email}</li>
              )}
              {resumeData.header?.phone && <li>{resumeData.header.phone}</li>}
              {resumeData.header?.location && (
                <li>{resumeData.header.location}</li>
              )}
              {resumeData.header?.linkedin && (
                <li>
                  <a
                    href={resumeData.header.linkedin}
                    className="underline decoration-teal-300/50"
                  >
                    LinkedIn
                  </a>
                </li>
              )}
              {resumeData.header?.website && (
                <li>
                  <a
                    href={resumeData.header.website}
                    className="underline decoration-teal-300/50"
                  >
                    Portfolio / GitHub
                  </a>
                </li>
              )}
            </ul>
          </section>

          {technical.length > 0 && (
            <section>
              <SidebarHeading>Technical Skills</SidebarHeading>
              <div className="flex flex-wrap gap-1.5">
                {technical.map((skill, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-sm bg-white/10 border border-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {soft.length > 0 && (
            <section>
              <SidebarHeading>Soft Skills</SidebarHeading>
              <ul className="space-y-1 text-xs text-white/85">
                {soft.map((skill, i) => (
                  <li key={i} className="flex gap-2">
                    <span style={{ color: TEAL }}>•</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {resumeData.education?.length > 0 && (
            <section>
              <SidebarHeading>Education</SidebarHeading>
              <div className="space-y-3 text-xs">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id || index}>
                    <p className="font-semibold text-white">
                      {edu.degree}
                      {edu.field && `, ${edu.field}`}
                    </p>
                    <p className="text-white/75">{edu.institution}</p>
                    <p className="text-white/60 text-[10px] mt-0.5">
                      {formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </p>
                    {edu.gpa && (
                      <p className="text-white/60 text-[10px]">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <SidebarHeading>Languages</SidebarHeading>
              <p className="text-xs text-white/85">{languages.join(" · ")}</p>
            </section>
          )}

          {resumeData.certifications?.length > 0 && (
            <section>
              <SidebarHeading>Certifications</SidebarHeading>
              <ul className="space-y-2 text-xs">
                {resumeData.certifications.map((cert, index) => (
                  <li key={cert.id || index}>
                    <p className="font-medium text-white">{cert.name}</p>
                    {cert.issuer && (
                      <p className="text-white/65 text-[10px]">{cert.issuer}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="flex-1 p-8 bg-white">
          <header className="mb-8 pb-6 border-b border-gray-100">
            <h1
              className="text-3xl font-bold tracking-tight mb-1"
              style={{ color: "#111827" }}
            >
              {resumeData.header?.fullName || "Your Name"}
            </h1>
            {professionalTitle && (
              <p className="text-base font-medium" style={{ color: TEAL }}>
                {professionalTitle}
              </p>
            )}
          </header>

          {resumeData.summary && (
            <section className="mb-7">
              <MainHeading>Professional Summary</MainHeading>
              <p className="text-gray-700 leading-relaxed text-sm">
                {resumeData.summary}
              </p>
            </section>
          )}

          {resumeData.experience?.length > 0 && (
            <section className="mb-7">
              <MainHeading>Work Experience</MainHeading>
              <div className="space-y-5">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id || index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDateRange(
                          exp.startDate,
                          exp.endDate,
                          exp.current
                        )}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: TEAL_DARK }}>
                      {exp.company}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                    {filterEmpty(exp.description).length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-gray-600 space-y-0.5 text-xs">
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
            <section className="mb-7">
              <MainHeading>Projects</MainHeading>
              <div className="space-y-4">
                {resumeData.projects.map((project, index) => (
                  <div
                    key={project.id || index}
                    className="pl-3 border-l-2"
                    style={{ borderColor: `${TEAL}66` }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-gray-900">{project.name}</h3>
                      {(project.link || project.github) && (
                        <a
                          href={project.link || project.github}
                          className="text-xs shrink-0"
                          style={{ color: TEAL }}
                        >
                          View
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    {filterEmpty(project.technologies).length > 0 && (
                      <p className="text-[10px] text-gray-500 mt-2">
                        {project.technologies.join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {allAchievements.length > 0 && (
            <section>
              <MainHeading>Achievements</MainHeading>
              <ul className="list-disc list-outside ml-4 text-gray-600 text-xs space-y-1">
                {allAchievements.map((item, i) => (
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
