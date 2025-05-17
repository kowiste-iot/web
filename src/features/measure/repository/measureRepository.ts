import { axiosClient } from '@/utils/http/axios-client'
import {
  Measure,
  type IMeasure,
  type IMeasureRepository,
} from '../domain/measure'
import type { MeasureDTO } from '../dtos/measureDTO'
import { MeasureMapper } from '../dtos/measureMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { IAsset } from '@/features/asset/domain/asset'
import type { ID } from '@/features/shared/domain/id'

export class MeasureRepository extends BaseRepository implements IMeasureRepository {
  constructor() {
    super('measures')
  }
  async findById(id: ID, assets: IAsset[]): Promise<IMeasure | null> {
    try {
      const response = await axiosClient().get<MeasureDTO>(
        `${this.baseUrl}/${id}`
      )
      return MeasureMapper.toDomain(response.data, assets)
    } catch (error) {
      throw error
    }
  }

  async findAll(assets: IAsset[]): Promise<IMeasure[]> {
    try {
      const response = await axiosClient().get<MeasureDTO[]>(this.baseUrl)
      return response.data
        .map((dto: MeasureDTO) => MeasureMapper.toDomain(dto, assets))
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

  async delete(id: ID): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
