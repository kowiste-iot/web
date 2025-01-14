import axiosServices from '@/shared/http/axios-client'
import { Alert, type IAlert, type IAlertRepository } from '../domain/alert'
import type { AlertDTO } from '../dtos/alertDTO'
import { AlertMapper } from '../dtos/alertMappers'

export class AlertRepository implements IAlertRepository {
  async findById(id: string): Promise<IAlert | null> {
    try {
      const response = await axiosServices.get<AlertDTO>(`/alerts/${id}`)
      return AlertMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IAlert[]> {
    try {
      const response = await axiosServices.get<AlertDTO[]>('/alerts')
      return response.data
        .map((dto: AlertDTO) => AlertMapper.toDomain(dto))
        .filter((alert: IAlert): alert is IAlert => alert !== null)
    } catch (error) {
      throw error
    }
  }

  async create(alert: IAlert): Promise<void> {
    try {
      const dto = AlertMapper.toDTO(new Alert(alert))
      await axiosServices.post('/alerts', dto)
    } catch (error) {
      throw error
    }
  }

  async update(alert: IAlert): Promise<void> {
    try {
      const dto = AlertMapper.toDTO(new Alert(alert))
      await axiosServices.put(`/alerts/${alert.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosServices.delete(`/alerts/${id}`)
    } catch (error) {
      throw error
    }
  }
}
