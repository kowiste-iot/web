import { axiosClient } from '@/utils/http/axios-client'
import { Widget, type IWidget, type IWidgetRepository } from '../domain/widget'
import type { WidgetDTO } from '../dtos/widgetDTO'
import { WidgetMapper } from '../dtos/widgetMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'

export class WidgetRepository
  extends BaseRepository
  implements IWidgetRepository
{
  constructor() {
    super('dashboards')
  }
  async findById(dashboardID: string, id: string): Promise<IWidget | null> {
    try {
      const response = await axiosClient().get<WidgetDTO>(
        `${this.baseUrl}/${dashboardID}/widgets/${id}`
      )
      return WidgetMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(dashboardID: string): Promise<IWidget[]> {
    try {
      const response = await axiosClient().get<WidgetDTO[]>(
        `${this.baseUrl}/${dashboardID}/widgets`
      )
      return response.data
        .map((dto: WidgetDTO) => WidgetMapper.toDomain(dto))
        .filter((widget: IWidget): widget is IWidget => widget !== null)
    } catch (error) {
      throw error
    }
  }

  async create(dashboardID: string, widget: IWidget): Promise<void> {
    try {
      const dto = WidgetMapper.toDTO(new Widget(widget))
      await axiosClient().post(`${this.baseUrl}/${dashboardID}/widgets`, dto)
    } catch (error) {
      throw error
    }
  }

  async update(dashboardID: string, widget: IWidget): Promise<void> {
    try {
      const dto = WidgetMapper.toDTO(new Widget(widget))
      await axiosClient().put(
        `${this.baseUrl}/${dashboardID}/widgets/${widget.id}`,
        dto
      )
    } catch (error) {
      throw error
    }
  }

  async delete(dashboardID: string, id: string): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${dashboardID}/widgets/${id}`)
    } catch (error) {
      throw error
    }
  }
}
