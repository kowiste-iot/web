import axiosServices from '@/shared/http/axios-client'
import { Asset, type IAsset, type IAssetRepository } from '../domain/asset'
import type { AssetDTO } from '../dtos/assetDTO'
import { AsssetMapper } from '../dtos/assetMappers'
import { useTenant } from '@/composable/useTenant'

export class AssetRepository implements IAssetRepository {
  private baseUrl: string
  constructor() {
    const { getTenantId } = useTenant()
    this.baseUrl = `${getTenantId()}/assets`
  }
  async findById(id: string): Promise<IAsset | null> {
    try {
      const response = await axiosServices.get<AssetDTO>(
        `${this.baseUrl}/${id}`
      )
      return AsssetMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IAsset[]> {
    try {
      const response = await axiosServices.get<AssetDTO[]>(this.baseUrl)
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
      await axiosServices.post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IAsset): Promise<void> {
    try {
      const dto = AsssetMapper.toDTO(new Asset(data))
      await axiosServices.put(`${this.baseUrl}/${data.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosServices.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
