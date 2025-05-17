import axiosInstance, { axiosClient } from '@/utils/http/axios-client'
import { Asset, type IAsset, type IAssetRepository } from '../domain/asset'
import type { AssetDTO } from '../dtos/assetDTO'
import { AsssetMapper } from '../dtos/assetMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class AssetRepository
  extends BaseRepository
  implements IAssetRepository
{
  constructor() {
    super('assets')
  }
  async findById(id: ID): Promise<IAsset | null> {
    try {
      const response = await axiosClient().get<AssetDTO>(
        `${this.baseUrl}/${id}`
      )
      return AsssetMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IAsset[]> {
    try {
      const response = await axiosClient().get<AssetDTO[]>(this.baseUrl)
      return response.data
        .map((dto: AssetDTO) => AsssetMapper.toDomain(dto))
        .filter((asset: IAsset): asset is IAsset => asset !== null)
    } catch (error) {
      throw error
    }
  }

  async create(data: IAsset): Promise<void> {
    try {
      const dto = AsssetMapper.toDTO(new Asset(data))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IAsset): Promise<void> {
    try {
      const dto = AsssetMapper.toDTO(new Asset(data))
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
