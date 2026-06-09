import axios, { AxiosInstance } from 'axios';
import { config } from './config';

export type UserType = 'student' | 'admin' | 'super_admin';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user_type: UserType;
  access_status?: string;
  user_id: string;
  name: string;
  email: string;
}

class ApiClient {
  client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.api.fullUrl,
      headers: { 'Content-Type': 'application/json' },
    });

    this.client.interceptors.request.use((cfg) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) cfg.headers.Authorization = `Bearer ${token}`;
      }
      return cfg;
    });
  }

  async register(data: Record<string, unknown>) {
    const res = await this.client.post('/auth/register', data);
    return res.data;
  }

  async login(email: string, password: string, user_type: UserType) {
    const res = await this.client.post<TokenResponse>('/auth/login', { email, password, user_type });
    return res.data;
  }

  async getActiveBatch() {
    const res = await this.client.get('/public/batches/active');
    return res.data;
  }

  async getPaymentConfig() {
    const res = await this.client.get('/payments/config');
    return res.data as { provider: string; dev_bypass: boolean };
  }

  async createPaymentOrder() {
    const res = await this.client.post('/payments/create-order');
    return res.data;
  }

  async verifyPayment(data: {
    order_id: string;
    payment_id: string;
    signature: string;
    status?: string;
  }) {
    const res = await this.client.post('/payments/verify', data);
    return res.data;
  }

  async getDashboard() {
    const res = await this.client.get('/students/me/dashboard');
    return res.data;
  }

  async getJobs() {
    const res = await this.client.get('/students/me/jobs');
    return res.data;
  }

  async applyJob(jobId: string) {
    const res = await this.client.post(`/students/me/jobs/${jobId}/apply`);
    return res.data;
  }

  async getApplications() {
    const res = await this.client.get('/students/me/applications');
    return res.data;
  }

  async listMyBatches() {
    const res = await this.client.get('/admin/my-batches');
    return res.data;
  }

  async getBatchDetail(batchId: string) {
    const res = await this.client.get(`/admin/batches/${batchId}`);
    return res.data;
  }

  async listAdmins() {
    const res = await this.client.get('/admin/admins');
    return res.data;
  }

  async createAdmin(data: Record<string, unknown>) {
    const res = await this.client.post('/admin/admins', data);
    return res.data;
  }

  async listAllBatches() {
    const res = await this.client.get('/admin/batches');
    return res.data;
  }

  async listStudents() {
    const res = await this.client.get('/admin/students');
    return res.data;
  }

  async manualGrant(studentId: string) {
    const res = await this.client.post('/payments/manual-grant', { student_id: studentId });
    return res.data;
  }

  async assignBatchAdmin(batchId: string, adminId: string) {
    const res = await this.client.post(`/admin/batches/${batchId}/assign-admin`, { admin_id: adminId });
    return res.data;
  }

  async syncBatchToDisha(batchId: string) {
    const res = await this.client.post(`/admin/batches/${batchId}/sync-disha`);
    return res.data;
  }

  async syncPendingBatchesToDisha() {
    const res = await this.client.post('/admin/batches/sync-disha-pending');
    return res.data;
  }
}

export const api = new ApiClient();
