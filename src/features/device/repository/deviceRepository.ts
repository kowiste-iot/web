import axiosServices, { axiosClient } from '@/shared/http/axios-client'
import { Device, type IDevice, type IDeviceRepository } from '../domain/device'
import type { DeviceDTO } from '../dtos/deviceDTO'
import { DeviceMapper } from '../dtos/deviceMappers'
import { useTenant } from '@/composable/useTenant'

export class DeviceRepository implements IDeviceRepository {
  private baseUrl: string
  constructor() {
    const { getTenantId } = useTenant()
    this.baseUrl = `${getTenantId()}/devices`
  }
  async findById(id: string): Promise<IDevice | null> {
    try {
      console.log('this', this.baseUrl)

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
      console.log('this', this.baseUrl)

      const response = await axiosClient().get<DeviceDTO[]>(this.baseUrl)
      return response.data
        .map((dto: DeviceDTO) => DeviceMapper.toDomain(dto))
        .filter((device: IDevice): device is IDevice => device !== null)
    } catch (error) {
      throw error
    }
  }

  async create(device: IDevice): Promise<void> {
    try {
      const dto = DeviceMapper.toDTO(new Device(device))
      await axiosClient().post(this.baseUrl, dto)
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

  async delete(id: string): Promise<void> {
    try {
      await axiosClient().delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      throw error
    }
  }
}
