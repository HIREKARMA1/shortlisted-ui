import axios from 'axios';
import { api } from '@/lib/api';
import type {
  BulkEmailCategory,
  BulkEmailCohort,
  BulkEmailLogsResponse,
  BulkEmailRecipientsResponse,
  BulkEmailAttachmentPolicy,
  BulkEmailSendRequest,
  BulkEmailSendResponse,
  BulkEmailUploadResponse,
} from '@/types/bulkEmail';

export function bulkEmailErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: unknown; message?: string; error?: string } | undefined;
    if (typeof data?.detail === 'string') return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((item) => String(item)).join(', ');
    }
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

export class BulkEmailService {
  async getCohorts(): Promise<BulkEmailCohort[]> {
    const res = await api.client.get<{ cohorts: BulkEmailCohort[] }>('/admin/bulk-email/cohorts');
    return res.data.cohorts;
  }

  async getRecipients(params: {
    category?: BulkEmailCategory;
    batchIds?: string[];
    studentIds?: string[];
  }): Promise<BulkEmailRecipientsResponse> {
    if (params.category === 'none') {
      return { count: 0, users: [] };
    }
    const res = await api.client.get<BulkEmailRecipientsResponse>('/admin/bulk-email/recipients', {
      params: {
        category: params.category === 'all' ? undefined : params.category,
        batch_ids: params.batchIds?.length ? params.batchIds : undefined,
        student_ids: params.studentIds?.length ? params.studentIds : undefined,
      },
      paramsSerializer: {
        indexes: null,
      },
    });
    return res.data;
  }

  async searchUsers(
    query: string,
    batchIds?: string[],
    limit = 20,
    offset = 0
  ): Promise<BulkEmailRecipientsResponse> {
    const res = await api.client.get<BulkEmailRecipientsResponse>('/admin/bulk-email/search', {
      params: {
        q: query,
        batch_ids: batchIds?.length ? batchIds : undefined,
        limit,
        offset,
      },
      paramsSerializer: {
        indexes: null,
      },
    });
    return res.data;
  }

  async uploadCsv(
    file: File,
    onUploadProgress?: (percent: number) => void
  ): Promise<BulkEmailUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.client.post<BulkEmailUploadResponse>('/admin/bulk-email/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!onUploadProgress || !event.total) return;
        onUploadProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      },
    });
    return res.data;
  }

  async getAttachmentPolicy(): Promise<BulkEmailAttachmentPolicy> {
    const res = await api.client.get<BulkEmailAttachmentPolicy>('/admin/bulk-email/attachment-policy');
    return res.data;
  }

  async previewEmail(payload: { subject: string; body: string }): Promise<string> {
    const res = await api.client.post<{ html: string }>('/admin/bulk-email/preview', payload);
    return res.data.html;
  }

  async sendBulkEmail(
    payload: BulkEmailSendRequest,
    files: File[] = [],
    onUploadProgress?: (percent: number) => void
  ): Promise<BulkEmailSendResponse> {
    const formData = new FormData();
    formData.append('subject', payload.subject);
    formData.append('body', payload.body);
    formData.append('emails', JSON.stringify(payload.emails ?? []));
    formData.append('student_ids', JSON.stringify(payload.student_ids ?? []));
    if (payload.category) formData.append('category', payload.category);
    if (payload.cohort_filter) formData.append('cohort_filter', payload.cohort_filter);
    files.forEach((file) => formData.append('files', file, file.name));
    const res = await api.client.post<BulkEmailSendResponse>('/admin/bulk-email/send', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!onUploadProgress || !event.total) return;
        onUploadProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      },
    });
    return res.data;
  }

  async getLogs(limit = 10): Promise<BulkEmailLogsResponse> {
    const res = await api.client.get<BulkEmailLogsResponse>('/admin/bulk-email/logs', {
      params: { limit },
    });
    return res.data;
  }
}

export const bulkEmailService = new BulkEmailService();
