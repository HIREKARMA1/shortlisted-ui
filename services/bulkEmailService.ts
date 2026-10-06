import axios from 'axios';
import { api } from '@/lib/api';
import type {
  BulkEmailCategory,
  BulkEmailCohort,
  BulkEmailLogsResponse,
  BulkEmailRecipientsResponse,
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

  async uploadCsv(file: File): Promise<BulkEmailUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.client.post<BulkEmailUploadResponse>('/admin/bulk-email/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async sendBulkEmail(payload: BulkEmailSendRequest): Promise<BulkEmailSendResponse> {
    const res = await api.client.post<BulkEmailSendResponse>('/admin/bulk-email/send', payload);
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
