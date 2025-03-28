import axiosInstance, { axiosClient } from '@/utils/http/axios-client'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import { Action, type IAction, type IActionRepository } from '../domain/action'
import type { ActionDTO } from '../dtos/actionDTO'
import { ActionMapper } from '../dtos/actionMappers'
import type { ID } from '@/features/shared/domain/id'

export class ActionRepository
  extends BaseRepository
  implements IActionRepository
{
  constructor() {
    super('actions')
  }
  async findById(id: ID): Promise<IAction | null> {
    try {
      const response = await axiosClient().get<ActionDTO>(
        `${this.baseUrl}/${id}`
      )
      return ActionMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IAction[]> {
    try {
      const response = await axiosClient().get<ActionDTO[]>(this.baseUrl)
      return response.data
        .map((dto: ActionDTO) => ActionMapper.toDomain(dto))
        .filter((action: IAction): action is IAction => action !== null)
    } catch (error) {
      throw error
    }
  }

  async create(data: IAction): Promise<void> {
    try {
      const dto = ActionMapper.toDTO(new Action(data))
      await axiosClient().post(this.baseUrl, dto)
    } catch (error) {
      throw error
    }
  }

  async update(data: IAction): Promise<void> {
    try {
      const dto = ActionMapper.toDTO(new Action(data))
      await axiosClient().put(`${this.baseUrl}/${data.id}`, dto)
    } catch (error) {
      throw error
    }
  }

  async delete(id: ID): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
