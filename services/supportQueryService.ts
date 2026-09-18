import { api } from '@/lib/api'
import {
  SupportPaymentDecision,
  SupportQuery,
  SupportQueryListParams,
  SupportQueryListResponse,
  SupportQueryStatus,
} from '@/types/supportQuery'

export class SupportQueryService {
  async list(params: SupportQueryListParams = {}): Promise<SupportQueryListResponse> {
    const response = await api.client.get<SupportQueryListResponse>('/admin/support-queries', {
      params: {
        status: params.status || undefined,
        enquiry_type: params.enquiry_type || undefined,
        q: params.q?.trim() || undefined,
        date_from: params.date_from || undefined,
        date_to: params.date_to || undefined,
        limit: params.limit ?? 20,
        offset: params.offset ?? 0,
      },
    })
    return response.data
  }

  async get(queryNumber: number): Promise<SupportQuery> {
    const response = await api.client.get<SupportQuery>(`/admin/support-queries/${queryNumber}`)
    return response.data
  }

  async updateStatus(queryNumber: number, status: SupportQueryStatus): Promise<SupportQuery> {
    const response = await api.client.patch<SupportQuery>(`/admin/support-queries/${queryNumber}`, {
      status,
    })
    return response.data
  }

  async updatePayment(
    queryNumber: number,
    decision: SupportPaymentDecision
  ): Promise<SupportQuery> {
    const response = await api.client.patch<SupportQuery>(
      `/admin/support-queries/${queryNumber}/payment`,
      { decision }
    )
    return response.data
  }
}

export const supportQueryService = new SupportQueryService()
