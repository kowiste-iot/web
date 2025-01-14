import axiosServices  from '@/shared/http/axios-client'
import { Widget, type IWidget, type IWidgetRepository } from '../domain/widget'
import type { WidgetDTO } from '../dtos/widgetDTO'
import { WidgetMapper } from '../dtos/widgetMappers'


export class WidgetRepository implements IWidgetRepository{
  async findById(id: string): Promise<IWidget | null> {
    try {
      const response = await axiosServices.get<WidgetDTO>(`/widgets/${id}`)
      return WidgetMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IWidget[]> {
    try {
      const response = await axiosServices.get<WidgetDTO[]>('/widgets')
      return response.data
        .map((dto: WidgetDTO) => WidgetMapper.toDomain(dto))
        .filter((widget: IWidget): widget is IWidget => widget !== null)
    } catch (error) {
      throw error
    }
  }

  async create(widget: IWidget): Promise<void> {
    try {
      const dto = WidgetMapper.toDTO(new Widget(widget))
      await axiosServices.post('/widgets', dto)
    } catch (error) {
      throw error
    }
  }

  async update(widget: IWidget): Promise<void> {
    try {
      const dto = WidgetMapper.toDTO(new Widget(widget))
      await axiosServices.put(`/widgets/${widget.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosServices.delete(`/widgets/${id}`)
    } catch (error) {
      throw error
    }
  }
}
