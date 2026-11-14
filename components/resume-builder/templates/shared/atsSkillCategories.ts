/** Heuristic skill bucketing for role-focused ATS templates. Plain text only. */

function matchesAny(skill: string, hints: string[]): boolean {
  const lower = skill.toLowerCase();
  return hints.some((hint) => lower.includes(hint));
}

const LANGUAGE_HINTS = [
  "java", "python", "javascript", "typescript", "c++", "c#", "golang", "go",
  "rust", "kotlin", "swift", "ruby", "php", "scala", "r", "sql", "bash", "shell",
];
const FRAMEWORK_HINTS = [
  "react", "next", "angular", "vue", "fastapi", "django", "flask", "spring",
  "node", "express", "nestjs", "dotnet", ".net", "rails", "laravel", "graphql",
  "rest", "redux", "tailwind", "jquery",
];
const DATABASE_HINTS = [
  "postgres", "mysql", "mongodb", "redis", "sqlite", "oracle", "dynamodb",
  "cassandra", "elasticsearch", "sql server", "snowflake", "bigquery",
];
const TOOL_HINTS = [
  "git", "docker", "kubernetes", "k8s", "jenkins", "postman", "selenium",
  "cypress", "aws", "azure", "gcp", "linux", "jira", "figma", "terraform",
  "ci/cd", "github", "gitlab",
];
const SQL_HINTS = ["sql", "postgres", "mysql", "oracle", "snowflake", "bigquery", "redshift", "sqlite", "t-sql", "pl/sql"];
const PYTHON_ANALYTICS_HINTS = [
  "python", "pandas", "numpy", "scipy", "scikit", "sklearn", "matplotlib",
  "seaborn", "plotly", "jupyter", "statsmodels", "r ",
];
const EXCEL_BI_HINTS = [
  "excel", "power bi", "tableau", "looker", "qlik", "spreadsheet", "vba",
  "power query", "dax", "google sheets", "metabase", "superset",
];
const PM_TOOL_HINTS = [
  "jira", "confluence", "asana", "trello", "monday", "ms project", "azure devops",
  "scrum", "agile", "kanban", "waterfall", "pmp", "prince2", "slack", "notion",
];
const FINANCE_HINTS = [
  "excel", "sap", "oracle", "quickbooks", "tally", "bloomberg", "tableau",
  "power bi", "sql", "vba", "hyperion", "netsuite", "xero", "gaap", "ifrs",
];
const SALES_TOOL_HINTS = [
  "salesforce", "hubspot", "zoho", "pipedrive", "marketo", "mailchimp",
  "google ads", "meta ads", "analytics", "crm", "semrush", "hootsuite",
  "linkedin sales", "outreach",
];

export function categorizeSoftwareSkills(skills: string[]) {
  const buckets = {
    programming: [] as string[],
    frameworks: [] as string[],
    databases: [] as string[],
    tools: [] as string[],
    other: [] as string[],
  };
  for (const skill of skills) {
    if (matchesAny(skill, LANGUAGE_HINTS)) buckets.programming.push(skill);
    else if (matchesAny(skill, FRAMEWORK_HINTS)) buckets.frameworks.push(skill);
    else if (matchesAny(skill, DATABASE_HINTS)) buckets.databases.push(skill);
    else if (matchesAny(skill, TOOL_HINTS)) buckets.tools.push(skill);
    else buckets.other.push(skill);
  }
  return buckets;
}

export function categorizeDataSkills(skills: string[]) {
  const buckets = {
    sql: [] as string[],
    pythonAnalytics: [] as string[],
    excelBi: [] as string[],
    other: [] as string[],
  };
  for (const skill of skills) {
    if (matchesAny(skill, SQL_HINTS)) buckets.sql.push(skill);
    else if (matchesAny(skill, PYTHON_ANALYTICS_HINTS)) buckets.pythonAnalytics.push(skill);
    else if (matchesAny(skill, EXCEL_BI_HINTS)) buckets.excelBi.push(skill);
    else buckets.other.push(skill);
  }
  return buckets;
}

export function categorizeByHints(skills: string[], hints: string[]) {
  const matched: string[] = [];
  const other: string[] = [];
  for (const skill of skills) {
    if (matchesAny(skill, hints)) matched.push(skill);
    else other.push(skill);
  }
  return { matched, other };
}

export const PM_TOOLS = PM_TOOL_HINTS;
export const FINANCE_TOOLS = FINANCE_HINTS;
export const SALES_TOOLS = SALES_TOOL_HINTS;
