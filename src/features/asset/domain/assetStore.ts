import type { ID } from '@/features/shared/domain/id'
import type { IAsset } from './asset'

export interface IAssetStore {
  assets: IAsset[]
  getAssetById: (id: ID) => IAsset | undefined
}
