import { axiosClient } from '@/utils/http/axios-client'
import { Action, type IAction, type IActionRepository } from '../domain/action'
import type { ActionDTO } from '../dtos/actionDTO'
import { ActionMapper } from '../dtos/actionMappers'

export class ActionRepository implements IActionRepository {
  async findById(id: string): Promise<IAction | null> {
    try {
      const response = await axiosClient().get<ActionDTO>(`/actions/${id}`)
      return ActionMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IAction[]> {
    try {
      const response = await axiosClient().get<ActionDTO[]>('/actions')
      return response.data
        .map((dto: ActionDTO) => ActionMapper.toDomain(dto))
        .filter((action: IAction): action is IAction => action !== null)
    } catch (error) {
      throw error
    }
  }

  async create(action: IAction): Promise<void> {
    try {
      const dto = ActionMapper.toDTO(new Action(action))
      await axiosClient().post('/actions', dto)
    } catch (error) {
      throw error
    }
  }

  async update(action: IAction): Promise<void> {
    try {
      const dto = ActionMapper.toDTO(new Action(action))
      await axiosClient().put(`/actions/${action.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosClient().delete(`/actions/${id}`)
    } catch (error) {
      throw error
    }
  }
}
