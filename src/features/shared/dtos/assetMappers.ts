import type { IHasParent, WithParentName } from '../domain/hasParent'

export class SharedAssetMapper {
  static setParentNames<T extends IHasParent, P extends IHasParent>(
    items: T[],
    parentList: P[]
  ): (T & { parentName: string })[] {
    const parentMap = new Map(parentList.map((parent) => [parent.id, parent]))

    return items.map((item) => {
      if (item.parent) {
        const parent = parentMap.get(item.parent)
        return {
          ...item,
          parentName: parent?.name ?? '',
        }
      }
      return {
        ...item,
        parentName: '',
      }
    })
  }
}
