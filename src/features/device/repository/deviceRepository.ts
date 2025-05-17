import { axiosClient } from '@/utils/http/axios-client'
import {
  Device,
  type IDevice,
  type IDevicePassword,
  type IDeviceRepository,
} from '../domain/device'
import type { DeviceDTO } from '../dtos/deviceDTO'
import { DeviceMapper } from '../dtos/deviceMappers'
import { BaseRepository } from '@/features/shared/domain/baseRepository'
import type { ID } from '@/features/shared/domain/id'

export class DeviceRepository
  extends BaseRepository
  implements IDeviceRepository
{
  constructor() {
    super('devices')
  }
  async findById(id: ID): Promise<IDevice | null> {
    try {
      const response = await axiosClient().get<DeviceDTO>(
        `${this.baseUrl}/${id}`
      )
      return DeviceMapper.toDomain(response.data)
    } catch (error) {
      throw error
    }
  }

  async findAll(): Promise<IDevice[]> {
    try {
      const response = await axiosClient().get<DeviceDTO[]>(this.baseUrl)
      return response.data
        .map((dto: DeviceDTO) => DeviceMapper.toDomain(dto))
        .filter((device: IDevice): device is IDevice => device !== null)
    } catch (error) {
      throw error
    }
  }

  async create(device: IDevice): Promise<IDevicePassword> {
    try {
      const dto = DeviceMapper.toDTO(new Device(device))
      const response = await axiosClient().post<IDevicePassword>(this.baseUrl, dto)      
      return DeviceMapper.toDevicePassword(response.data)
    } catch (error) {
      throw error
    }
  }

  async update(device: IDevice): Promise<void> {
    try {
      const dto = DeviceMapper.toDTO(new Device(device))
      await axiosClient().put(`${this.baseUrl}/${device.id}`, dto)
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
