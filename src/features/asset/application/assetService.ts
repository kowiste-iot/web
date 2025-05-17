import type { INotificationService } from '@/features/notification/application/notificationService'
import { Asset, type IAsset, type IAssetRepository } from '../domain/asset'
import { useAssetStore } from '../stores/useAssetStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

export class AssetService {
  constructor(
    private readonly assetRepository: IAssetRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getAsset(id: ID): Promise<IAsset | null> {
    try {
      const asset = await this.assetRepository.findById(id)
      return asset
    } catch (error) {
      const errors = ValidationError.fromRequest<IAsset>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch asset: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getAssets(): Promise<IAsset[]> {
    try {
      const assets = await this.assetRepository.findAll()
      return SharedAssetMapper.setParentNames(assets, assets)
    } catch (error) {
      const errors = ValidationError.fromRequest<IAsset>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch assets: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createAsset(data: IAsset): Promise<ValidationError<IAsset> | null> {
    try {
      const errors = Asset.validate(data)
      if (errors.hasErrors()) {
        return errors
      }
      const asset = new Asset(data)
      await this.assetRepository.create(asset)
      this.notificationService.success('Asset created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IAsset>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create asset: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateAsset(data: IAsset): Promise<ValidationError<IAsset> | null> {
    try {
      const errors = Asset.validate(data)
      if (errors.hasErrors()) {
        return errors
      }
      const existingAsset = useAssetStore().getAssetById(data.id)
      if (!existingAsset) throw new Error('Asset not found')

      const updatedAsset = new Asset({ ...existingAsset, ...data })

      await this.assetRepository.update(updatedAsset)
      this.notificationService.success('Asset update successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IAsset>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update asset: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteAsset(id: ID): Promise<void> {
    try {
      await this.assetRepository.delete(id)
      this.notificationService.success('Asset delete successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IAsset>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete asset: ' + errors.getError('gError')!
      )
      return
    }
  }
}
