import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { WidgetDTO } from './widgetDTO'
import { type IWidget, Widget } from '../domain/widget'

export class WidgetMapper extends BaseMapper {
  static toDomain(raw: WidgetDTO): IWidget {
    return new Widget({
      id: raw.id,
      dashboardID: raw.dashboardID,
      type: raw.type,
      i: raw.i,
      x: raw.x,
      y: raw.y,
      w: raw.w,
      h: raw.h,
      data: {
        label: raw.data.label,
        showLabel: raw.data.showLabel,
        showEmotion: raw.data.showEmotion,
        trueEmotion: raw.data.trueEmotion,
        link: raw.data.link.map((l) => ({
          measure: l.measure,
          tag: l.tag,
          legend: l.legend,
        })),
        options: raw.data.options,
      },
    })
  }

  static toDTO(domain: Widget): WidgetDTO {
    return {
      id: domain.id,
      dashboardID: domain.dashboardID,
      type: domain.type,
      i: domain.i,
      x: domain.x,
      y: domain.y,
      w: domain.w,
      h: domain.h,
      data: {
        label: domain.data.label,
        showLabel: domain.data.showLabel,
        showEmotion: domain.data.showEmotion,
        trueEmotion: domain.data.trueEmotion,
        link: domain.data.link.map((l) => ({
          measure: l.measure,
          tag: l.tag,
          legend: l.legend,
        })),
        options: domain.data.options,
      },
    }
  }
  static toPositionDTO(domain: Widget): Partial<WidgetDTO> {
    return {
      id: domain.id,
      dashboardID: domain.dashboardID,
      x: domain.x,
      y: domain.y,
      w: domain.w,
      h: domain.h,
    }
  }
}
