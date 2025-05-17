import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { IMeasureData } from '@/features/shared/domain/measureData'

export class WebsocketMapper extends BaseMapper {
  static toMeasureUpdateDomain(raw: string): IMeasureData {
    const tZ = this.getOrgTimezone()
    let temp: IMeasureData = {} as IMeasureData
    temp = JSON.parse(atob(raw))
    return temp
  }
}
