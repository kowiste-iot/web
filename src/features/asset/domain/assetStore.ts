import type { IAsset } from './asset'

export interface IAssetStore {
  assets: IAsset[]
  getAssetById: (id: string) => IAsset | undefined
}
