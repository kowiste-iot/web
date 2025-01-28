import axiosServices, { axiosClient } from '@/shared/http/axios-client'
import {
  Dashboard,
  type IDashboard,
  type IDashboardRepository,
} from '../domain/dashboard'
import type { DashboardDTO } from '../dtos/dashboardDTO'
import { DashboardMapper } from '../dtos/dashboardMappers'
import { useTenant } from '@/composable/useTenant'

export class DashboardRepository implements IDashboardRepository {
  private baseUrl: string
  constructor() {
    const { getTenantId } = useTenant()
    this.baseUrl = `${getTenantId()}/dashboards`
  }
  async findById(id: string): Promise<IDashboard | null> {
    try {
      const response = await axiosClient().get<DashboardDTO>(
        `${this.baseUrl}/${id}`
      )
      return DashboardMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IDashboard[]> {
    try {
      const response = await axiosClient().get<DashboardDTO[]>(this.baseUrl)
      return response.data
        .map((dto: DashboardDTO) => DashboardMapper.toDomain(dto))
        .filter(
          (dashboard: IDashboard): dashboard is IDashboard => dashboard !== null
        )
    } catch (error) {
      throw error
    }
  }

  async create(dashboard: IDashboard): Promise<void> {
    try {
      const dto = DashboardMapper.toDTO(new Dashboard(dashboard))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(dashboard: IDashboard): Promise<void> {
    try {
      const dto = DashboardMapper.toDTO(new Dashboard(dashboard))
      await axiosClient().put(`${this.baseUrl}/${dashboard.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
