import { axiosClient } from '@/utils/http/axios-client'
import { Widget, type IWidget, type IWidgetRepository } from '../domain/widget'
import type { WidgetDTO } from '../dtos/widgetDTO'
import { WidgetMapper } from '../dtos/widgetMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class WidgetRepository
  extends BaseRepository
  implements IWidgetRepository
{
  constructor() {
    super('dashboards')
  }
  async findById(dashboardID: ID, id: ID): Promise<IWidget | null> {
    try {
      const response = await axiosClient().get<WidgetDTO>(
        `${this.baseUrl}/${dashboardID}/widgets/${id}`
      )
      return WidgetMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(dashboardID: ID): Promise<IWidget[]> {
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

  async create(dashboardID: ID, widget: IWidget): Promise<void> {
    try {
      const dto = WidgetMapper.toDTO(new Widget(widget))
      await axiosClient().post(`${this.baseUrl}/${dashboardID}/widgets`, dto)
    } catch (error) {
      throw error
    }
  }

  async update(dashboardID: ID, widget: IWidget): Promise<void> {
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
  async updatePosition(dashboardID: ID, widget: IWidget): Promise<void> {
    try {      
      const dto = WidgetMapper.toPositionDTO(new Widget(widget))
      await axiosClient().put(
        `${this.baseUrl}/${dashboardID}/widgets/${widget.id}/position`,
        dto
      )
    } catch (error) {
      throw error
    }
  }

  async delete(dashboardID: ID, id: ID): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${dashboardID}/widgets/${id}`)
    } catch (error) {
      throw error
    }
  }
}
