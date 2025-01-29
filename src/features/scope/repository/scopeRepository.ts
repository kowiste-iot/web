// features/resource/repository/resourceRepository.ts
import { axiosClient } from '@/utils/http/axios-client'
import { type IScope, type IScopeRepository } from '../domain/scope'
import type { ScopeDTO } from '../dtos/scopeDTO'
import { ScopeMapper } from '../dtos/scopeMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'

export class ScopeRepository
  extends BaseRepository
  implements IScopeRepository
{
  constructor() {
    super('scopes')
  }

  async findAll(): Promise<IScope[]> {
    try {
      const response = await axiosClient().get<ScopeDTO[]>(this.baseUrl)
      return response.data
        .map((dto: ScopeDTO) => ScopeMapper.toDomain(dto))
        .filter((scope: IScope): scope is IScope => scope !== null)
    } catch (error) {
      throw error
    }
  }
}
