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

  async getTestimonials() {
    const res = await this.client.get('/public/testimonials');
    return res.data;
  }

  async getSuccessStories() {
    const res = await this.client.get('/public/success-stories');
    return res.data;
  }

  async getCommunity() {
    const res = await this.client.get('/public/community');
    return res.data;
  }

  async submitContact(data: { name: string; email: string; phone: string; message: string }) {
    const res = await this.client.post('/public/contact', data);
    return res.data;
  }

  async getPaymentConfig() {
    const res = await this.client.get('/payments/config');
    return res.data as { provider: string; amount_paise: number };
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

  async getAdminJobs(batchId?: string) {
    const res = await this.client.get('/admin/jobs', {
      params: batchId ? { batch_id: batchId } : undefined,
    });
    return res.data;
  }

  async getJobApplicants(jobId: string, batchId: string) {
    const res = await this.client.get(`/admin/jobs/${jobId}/applicants`, {
      params: { batch_id: batchId },
    });
    return res.data;
  }

  async getCoordinatorStudents(batchId?: string) {
    const res = await this.client.get('/admin/my-students', {
      params: batchId ? { batch_id: batchId } : undefined,
    });
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

  async updateBatch(batchId: string, data: Record<string, unknown>) {
    const res = await this.client.patch(`/admin/batches/${batchId}`, data);
    return res.data;
  }

  async listCoordinators() {
    const res = await this.client.get('/admin/coordinators');
    return res.data;
  }

  async listTestimonials() {
    const res = await this.client.get('/admin/testimonials');
    return res.data;
  }

  async createTestimonial(data: FormData) {
    const res = await this.client.post('/admin/testimonials', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async updateTestimonialStatus(testimonialId: string, isActive: boolean) {
    const data = new FormData();
    data.append('is_active', String(isActive));
    const res = await this.client.patch(`/admin/testimonials/${testimonialId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async deleteTestimonial(testimonialId: string) {
    const res = await this.client.delete(`/admin/testimonials/${testimonialId}`);
    return res.data;
  }

  async listSuccessStories() {
    const res = await this.client.get('/admin/success-stories');
    return res.data;
  }

  async createSuccessStory(data: FormData) {
    const res = await this.client.post('/admin/success-stories', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async updateSuccessStoryStatus(storyId: string, isActive: boolean) {
    const data = new FormData();
    data.append('is_active', String(isActive));
    const res = await this.client.patch(`/admin/success-stories/${storyId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async deleteSuccessStory(storyId: string) {
    const res = await this.client.delete(`/admin/success-stories/${storyId}`);
    return res.data;
  }

  async listCommunityPhotos() {
    const res = await this.client.get('/admin/community-photos');
    return res.data;
  }

  async createCommunityPhoto(data: FormData) {
    const res = await this.client.post('/admin/community-photos', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async updateCommunityPhotoStatus(photoId: string, isActive: boolean, displayOrder?: number) {
    const data = new FormData();
    data.append('is_active', String(isActive));
    if (displayOrder !== undefined) data.append('display_order', String(displayOrder));
    const res = await this.client.patch(`/admin/community-photos/${photoId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }

  async deleteCommunityPhoto(photoId: string) {
    const res = await this.client.delete(`/admin/community-photos/${photoId}`);
    return res.data;
  }

  async updateAdmin(adminId: string, data: Record<string, unknown>) {
    const res = await this.client.patch(`/admin/admins/${adminId}`, data);
    return res.data;
  }

  async deactivateAdmin(adminId: string) {
    const res = await this.client.delete(`/admin/admins/${adminId}`);
    return res.data;
  }

  async getRevenueReport(params?: { batch_id?: string; date_from?: string; date_to?: string }) {
    const res = await this.client.get('/admin/revenue', { params });
    return res.data;
  }

  async updateStudentAccessStatus(studentId: string, access_status: 'active' | 'inactive') {
    const res = await this.client.patch(`/admin/students/${studentId}/access-status`, {
      access_status,
    });
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

  async getAdminClasses(params?: { batch_id?: string; filter?: string }) {
    const res = await this.client.get('/admin/classes', { params });
    return res.data;
  }

  async getAdminClassDetail(classId: string) {
    const res = await this.client.get(`/admin/classes/${classId}`);
    return res.data;
  }

  async createClass(data: Record<string, unknown>) {
    const res = await this.client.post('/admin/classes', data);
    return res.data;
  }

  async updateClass(classId: string, data: Record<string, unknown>) {
    const res = await this.client.patch(`/admin/classes/${classId}`, data);
    return res.data;
  }

  async deleteClass(classId: string) {
    const res = await this.client.delete(`/admin/classes/${classId}`);
    return res.data;
  }

  async getStudentClasses(filter?: string) {
    const res = await this.client.get('/students/me/classes', {
      params: filter ? { filter } : undefined,
    });
    return res.data;
  }

  async joinClass(classId: string) {
    const res = await this.client.post(`/students/me/classes/${classId}/join`);
    return res.data;
  }
}

export const api = new ApiClient();
