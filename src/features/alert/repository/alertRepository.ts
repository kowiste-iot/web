import { axiosClient } from '@/utils/http/axios-client'
import { Alert, type IAlert, type IAlertRepository } from '../domain/alert'
import type { AlertDTO } from '../dtos/alertDTO'
import { AlertMapper } from '../dtos/alertMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class AlertRepository
  extends BaseRepository
  implements IAlertRepository
{
  constructor() {
    super('alerts')
  }
  async findById(id: ID): Promise<IAlert | null> {
    try {
      const response = await axiosClient().get<AlertDTO>(
        `${this.baseUrl}/${id}`
      )
      return AlertMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IAlert[]> {
    try {
      const response = await axiosClient().get<AlertDTO[]>(this.baseUrl)      
      return response.data
        .map((dto: AlertDTO) => AlertMapper.toDomain(dto))
        .filter((alert: IAlert): alert is IAlert => alert !== null)
    } catch (error) {
      throw error
    }
  }

  async create(data: IAlert): Promise<void> {
    try {
      const dto = AlertMapper.toDTO(new Alert(data))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IAlert): Promise<void> {
    try {
      const dto = AlertMapper.toDTO(new Alert(data))
      await axiosClient().put(`${this.baseUrl}/${data.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
