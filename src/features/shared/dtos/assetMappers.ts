// features/shared/dtos/assetMappers.ts
import type { IAsset } from '@/features/asset/domain/asset'

export class SharedAssetMapper {
  static setAssetValues(assets: IAsset[]): IAsset[] {
    const assetMap = new Map(assets.map((asset) => [asset.id, asset]))

    return assets.map((asset) => {
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
