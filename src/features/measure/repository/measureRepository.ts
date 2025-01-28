import { axiosClient } from '@/utils/http/axios-client'
import {
  Measure,
  type IMeasure,
  type IMeasureRepository,
} from '../domain/measure'
import type { MeasureDTO } from '../dtos/measureDTO'
import { MeasureMapper } from '../dtos/measureMappers'
import { useTenant } from '@/composable/useTenant'

export class MeasureRepository implements IMeasureRepository {
  private baseUrl: string
  constructor() {
    const { getTenantId } = useTenant()
    this.baseUrl = `${getTenantId()}/measures`
  }
  async findById(id: string): Promise<IMeasure | null> {
    try {
      const response = await axiosClient().get<MeasureDTO>(
        `${this.baseUrl}/${id}`
      )
      return MeasureMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IMeasure[]> {
    try {
      const response = await axiosClient().get<MeasureDTO[]>(this.baseUrl)
      return response.data
        .map((dto: MeasureDTO) => MeasureMapper.toDomain(dto))
        .filter((measure: IMeasure): measure is IMeasure => measure !== null)
    } catch (error) {
      throw error
    }
  }

  async create(measure: IMeasure): Promise<void> {
    try {
      const dto = MeasureMapper.toDTO(new Measure(measure))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(measure: IMeasure): Promise<void> {
    try {
      const dto = MeasureMapper.toDTO(new Measure(measure))
      await axiosClient().put(`${this.baseUrl}/${measure.id}`, dto)
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
