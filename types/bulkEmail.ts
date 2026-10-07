export type BulkEmailCategory = 'all' | 'none';

export type RecipientSource = 'filter' | 'search' | 'manual' | 'csv';

export type BulkEmailRecipient = {
  id?: string;
  name?: string | null;
  email: string;
  role?: string | null;
  cohort?: string | null;
  status?: string | null;
};

export type ManagedRecipient = BulkEmailRecipient & {
  source: RecipientSource;
};

export type BulkEmailCohort = {
  id: string;
  name: string;
};

export type BulkEmailRecipientsResponse = {
  count: number;
  users: BulkEmailRecipient[];
  limit?: number;
  offset?: number;
};

export type BulkEmailUploadResponse = {
  success: boolean;
  imported: number;
  emails: string[];
};

export type BulkEmailSendRequest = {
  category?: BulkEmailCategory;
  subject: string;
  body: string;
  emails: string[];
  cohort_filter?: string;
};

export type BulkEmailSendResponse = {
  success: boolean;
  message: string;
  log_id?: string;
  recipient_count?: number;
  success_count?: number;
  failure_count?: number;
  queued?: boolean;
  error?: string | null;
};

export type BulkEmailLog = {
  id: string;
  subject: string;
  recipient_count: number;
  category?: string | null;
  cohort_filter?: string | null;
  sent_by_admin: string;
  sent_at: string;
  success_count: number;
  failure_count: number;
  status: string;
};

export type BulkEmailLogsResponse = {
  logs: BulkEmailLog[];
  total: number;
};
