import { ResumeData } from "./types";
import { filterEmpty } from "./utils";

export function collectAchievements(resumeData: ResumeData): string[] {
  return (resumeData.education || []).flatMap((edu) =>
    filterEmpty(edu.achievements)
  );
}

export function contactParts(
  resumeData: ResumeData,
  opts?: { includeLinks?: boolean }
): string[] {
  const parts = [
    resumeData.header?.email,
    resumeData.header?.phone,
    resumeData.header?.location,
  ].filter(Boolean) as string[];
  if (opts?.includeLinks !== false) {
    if (resumeData.header?.linkedin) parts.push(resumeData.header.linkedin);
    if (resumeData.header?.website) parts.push(resumeData.header.website);
  }
  return parts;
}

export function skillLists(resumeData: ResumeData) {
  return {
    technical: filterEmpty(resumeData.skills?.technical),
    soft: filterEmpty(resumeData.skills?.soft),
    languages: filterEmpty(resumeData.skills?.languages),
  };
}
