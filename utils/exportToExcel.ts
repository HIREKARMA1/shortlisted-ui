export type AppliedStudentExport = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  college?: string;
  branch?: string;
  graduation_year?: number;
  skills?: string;
  preferred_roles?: string;
  batch_name?: string;
  applied_at?: string;
  status?: string;
  resume_url?: string;
};

export type CoordinatorStudentExport = {
  name: string;
  email: string;
  phone?: string;
  college?: string;
  branch?: string;
  graduation_year?: number;
  batch_name?: string;
  joined_at?: string;
  payment_amount_paise?: number | null;
  payment_currency?: string;
  payment_mode?: string;
  payment_date?: string;
  jobs_applied?: number;
  jobs_selected?: number;
  offer_letters?: { job_title?: string; company_name?: string; url: string }[];
  last_login?: string;
  access_status?: string;
};

const STUDENT_CSV_HEADERS = [
  'Student Name',
  'Email',
  'Phone',
  'College',
  'Branch',
  'Graduation Year',
  'Skills',
] as const;

const COORDINATOR_STUDENT_CSV_HEADERS = [
  'Name',
  'Email',
  'Phone',
  'College',
  'Branch',
  'Graduation Year',
  'Batch',
  'Joined Batch',
  'Payment',
  'Payment Mode',
  'Paid On',
  'Jobs Applied',
  'Jobs Selected',
  'Offer Letters',
  'Last Login',
  'Access Status',
] as const;

const APPLIED_STUDENT_CSV_HEADERS = [
  'Name',
  'Email',
  'Phone',
  'Batch',
  'College',
  'Branch',
  'Graduation Year',
  'Skills',
  'Preferred Roles',
  'Applied Date',
  'Status',
  'Resume URL',
] as const;

const ANALYTICS_RESULT_CSV_HEADERS = [
  'Assessment Status',
  'Overall Score',
  'Max Score',
  'Percentage',
  'Pass/Fail',
  'Rounds Completed',
  'Snapshot 1 URL',
  'Snapshot 2 URL',
  'Snapshot 3 URL',
  'Snapshot 4 URL',
] as const;

export interface AnalyticsExport {
  email: string;
  student_name: string;
  status: string;
  total_score: number | null | undefined;
  max_score: number;
  percentage: number | null | undefined;
  pass_fail: string;
  rounds_completed: number;
  snapshot_1_url?: string;
  snapshot_2_url?: string;
  snapshot_3_url?: string;
  snapshot_4_url?: string;
  profile?: AppliedStudentExport | null;
}

function escapeCsvCell(cell: unknown): string {
  const cellStr = String(cell ?? '').replace(/"/g, '""');
  if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
    return `"${cellStr}"`;
  }
  return cellStr;
}

function buildCsvContent(headers: readonly string[], rows: string[][]): string {
  return [headers.join(','), ...rows.map((row) => row.map(escapeCsvCell).join(','))].join('\n');
}

function downloadCsvBlob(content: string, filename: string) {
  const blob = new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function slugify(value: string): string {
  return value.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '') || 'export';
}

function formatPhoneForCsv(phone?: string | null): string {
  if (!phone) return '';
  return `="${String(phone).trim()}"`;
}

function formatPaymentForCsv(paise?: number | null, currency?: string): string {
  if (paise == null) return '';
  const amount = Number(paise) / 100;
  const code = currency || 'INR';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: code }).format(amount);
}

function formatDateForCsv(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString();
}

function formatOfferLetters(
  offers?: { job_title?: string; company_name?: string; url: string }[],
): string {
  if (!offers?.length) return '';
  return offers
    .map((offer) => {
      const label = offer.job_title || offer.company_name || 'Offer';
      return `${label}: ${offer.url}`;
    })
    .join(' | ');
}

export function exportCoordinatorStudentsToCSV(
  students: CoordinatorStudentExport[],
  label = 'Students',
) {
  const rows = students.map((student) => [
    student.name || '',
    student.email || '',
    formatPhoneForCsv(student.phone),
    student.college || '',
    student.branch || '',
    student.graduation_year != null ? String(student.graduation_year) : '',
    student.batch_name || '',
    formatDateForCsv(student.joined_at),
    formatPaymentForCsv(student.payment_amount_paise, student.payment_currency),
    student.payment_mode || '',
    formatDateForCsv(student.payment_date),
    String(student.jobs_applied ?? 0),
    String(student.jobs_selected ?? 0),
    formatOfferLetters(student.offer_letters),
    formatDateForCsv(student.last_login),
    student.access_status || '',
  ]);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCsvBlob(
    buildCsvContent(COORDINATOR_STUDENT_CSV_HEADERS, rows),
    `${slugify(label)}_${timestamp}.csv`,
  );
}

const BATCH_ROSTER_CSV_HEADERS = ['Name', 'Email', 'Phone', 'Access Status'] as const;

export function exportBatchRosterToCSV(
  students: { name?: string; email?: string; phone?: string; access_status?: string }[],
  batchName: string,
) {
  const rows = students.map((student) => [
    student.name || '',
    student.email || '',
    formatPhoneForCsv(student.phone),
    student.access_status || '',
  ]);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCsvBlob(
    buildCsvContent(BATCH_ROSTER_CSV_HEADERS, rows),
    `${slugify(batchName)}_Roster_${timestamp}.csv`,
  );
}

export function exportAppliedStudentsToCSV(
  applicants: AppliedStudentExport[],
  jobTitle: string,
  companyName?: string,
  batchName?: string,
) {
  const rows = applicants.map((row) => [
    row.name || '',
    row.email || '',
    formatPhoneForCsv(row.phone),
    row.batch_name || batchName || '',
    row.college || '',
    row.branch || '',
    row.graduation_year != null ? String(row.graduation_year) : '',
    row.skills || '',
    row.preferred_roles || '',
    formatDateForCsv(row.applied_at),
    row.status || '',
    row.resume_url || '',
  ]);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Applied_Students_${slugify(jobTitle)}_${slugify(companyName || 'Job')}_${timestamp}.csv`;
  downloadCsvBlob(buildCsvContent(APPLIED_STUDENT_CSV_HEADERS, rows), filename);
}

function formatStudentCsvRow(
  profile: AppliedStudentExport | null | undefined,
  fallback: { name?: string; email?: string }
): string[] {
  return [
    profile?.name || fallback.name || '',
    profile?.email || fallback.email || '',
    profile?.phone || '',
    profile?.college || '',
    profile?.branch || '',
    profile?.graduation_year != null ? String(profile.graduation_year) : '',
    profile?.skills || '',
  ];
}

function formatAnalyticsResultCsvRow(item: AnalyticsExport): string[] {
  const displayStatus = ['PASSED', 'FAILED', 'COMPLETED'].includes(item.status)
    ? 'EVALUATED'
    : item.status;
  return [
    displayStatus,
    item.total_score != null ? String(item.total_score) : '-',
    String(item.max_score ?? '-'),
    item.percentage != null ? item.percentage.toFixed(1) : '-',
    item.pass_fail,
    String(item.rounds_completed || 0),
    item.snapshot_1_url || '',
    item.snapshot_2_url || '',
    item.snapshot_3_url || '',
    item.snapshot_4_url || '',
  ];
}

export const exportAnalyticsToCSV = (data: AnalyticsExport[], assessmentName: string) => {
  const headers = [...STUDENT_CSV_HEADERS, ...ANALYTICS_RESULT_CSV_HEADERS];
  const csvData = data.map((item) => [
    ...formatStudentCsvRow(item.profile, {
      name: item.student_name,
      email: item.email,
    }),
    ...formatAnalyticsResultCsvRow(item),
  ]);
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${assessmentName.replace(/[^a-zA-Z0-9]/g, '_')}_Analytics_${timestamp}.csv`;
  downloadCsvBlob(buildCsvContent(headers, csvData), filename);
};

export function buildAppliedStudentLookups(students: AppliedStudentExport[]) {
  const byId = new Map<string, AppliedStudentExport>();
  const byEmail = new Map<string, AppliedStudentExport>();
  for (const student of students) {
    if (student.id) byId.set(student.id.toLowerCase(), student);
    if (student.email) byEmail.set(student.email.trim().toLowerCase(), student);
  }
  return { byId, byEmail };
}

export function resolveAppliedStudentProfile(
  attempt: { student_id?: string; email?: string; student_email?: string },
  lookups: ReturnType<typeof buildAppliedStudentLookups>
): AppliedStudentExport | null {
  const studentId = attempt.student_id?.trim().toLowerCase();
  if (studentId && lookups.byId.has(studentId)) return lookups.byId.get(studentId)!;
  const email = (attempt.email || attempt.student_email || '').trim().toLowerCase();
  if (email && lookups.byEmail.has(email)) return lookups.byEmail.get(email)!;
  return null;
}

export function mapAttemptStudentProfileToExport(
  attempt: {
    student_id?: string;
    student_name?: string;
    email?: string;
    student_email?: string;
    student_profile?: AppliedStudentExport | null;
  },
  jobApplication: AppliedStudentExport | null
): AppliedStudentExport | null {
  if (jobApplication) return jobApplication;
  if (attempt.student_profile) return attempt.student_profile;
  if (attempt.student_name || attempt.email) {
    return {
      id: attempt.student_id,
      name: attempt.student_name,
      email: attempt.email || attempt.student_email,
    };
  }
  return null;
}
