import { BaseMapper } from '@/features/shared/dtos/baseMapper'
import type { WidgetDTO } from './widgetDTO'
import { type IWidget, Widget } from '../domain/widget'

export class WidgetMapper extends BaseMapper {
  static toDomain(raw: WidgetDTO): IWidget {
    return new Widget({
      id: raw.id,
      dashboardID: raw.dashboard_id,
      type: raw.type,
      i: raw.i,
      x: raw.x,
      y: raw.y,
      w: raw.w,
      h: raw.h,
      data: {
        label: raw.data.label,
        showLabel: raw.data.show_label,
        showEmotion: raw.data.show_emotion,
        trueEmotion: raw.data.true_emotion,
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
      dashboard_id: domain.dashboardID,
      type: domain.type,
      i: domain.i,
      x: domain.x,
      y: domain.y,
      w: domain.w,
      h: domain.h,
      data: {
        label: domain.data.label,
        show_label: domain.data.showLabel,
        show_emotion: domain.data.showEmotion,
        true_emotion: domain.data.trueEmotion,
        link: domain.data.link.map((l) => ({
          measure: l.measure,
          tag: l.tag,
          legend: l.legend,
        })),
        options: domain.data.options,
      },
    }
  }
}
