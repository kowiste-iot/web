import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import { EValidation } from '@/features/shared/enum/EValidation'
import { Asset, type IAsset, type IAssetRepository } from '../domain/asset'
import { useAssetStore } from '../stores/useAssetStore'

export class AssetService {
  constructor(
    private readonly assetRepository: IAssetRepository,
    private readonly notificationService: INotificationService
  ) {}

  async getAsset(id: string): Promise<IAsset | null> {
    try {
      const asset = await this.assetRepository.findById(id)
      return asset
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch asset: ${error.message}`
          : 'Failed to fetch asset'
      this.notificationService.error(msg)
      return null
    }
  }

  async getAssets(): Promise<IAsset[]> {
    try {
      const assets = await this.assetRepository.findAll()
      return this.setAssetValues(assets)
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch assets: ${error.message}`
          : 'Failed to fetch assets'
      this.notificationService.error(msg)
      return []
    }
  }

  async createAsset(data: IAsset): Promise<boolean> {
    try {
      const errors = Asset.validate(data)
      console.log('ass err', errors)

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const asset = new Asset(data)
      await this.assetRepository.create(asset)
      this.notificationService.success('Asset created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid asset data')
      } else {
        this.notificationService.error('Failed to create asset')
      }
      return false
    }
  }

  async updateAsset(data: IAsset): Promise<boolean> {
    try {
      const errors = Asset.validate(data)
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }
      const existingAsset = useAssetStore().getAssetById(data.id)
      if (!existingAsset) throw new Error('Asset not found')

      const updatedAsset = new Asset({ ...existingAsset, ...data })

      await this.assetRepository.update(updatedAsset)
      this.notificationService.success('Asset update successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid asset data')
      } else {
        this.notificationService.error('Failed to update asset')
      }
      return false
    }
  }

  async deleteAsset(id: string): Promise<void> {
    try {
      await this.assetRepository.delete(id)
      this.notificationService.success('Asset delete successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete asset: ${error.message}`
          : 'Failed to delete asset'
      this.notificationService.error(msg)
    }
  }

  private setAssetValues(data: IAsset[]): IAsset[] {
    const assetMap = new Map(data.map((asset) => [asset.id, asset]))

    return data.map((asset) => {
      if (asset.parent) {
        const parent = assetMap.get(asset.parent)
        return {
          ...asset,
          parentName: parent?.name ?? '',
        }
      }
      return asset
    })
  }
}
