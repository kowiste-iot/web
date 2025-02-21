import { z } from 'zod'
import type { INotificationService } from '@/features/notification/application/notificationService'
import {
  Measure,
  type IMeasure,
  type IMeasureRepository,
} from '../domain/measure'
import { useMeasureStore } from '../stores/useMeasureStore'
import type { IAssetStore } from '@/features/asset/domain/assetStore'
import { useAssetStore } from '@/features/asset/stores/useAssetStore'
import { SharedAssetMapper } from '@/features/shared/dtos/assetMappers'

const assetStore = useAssetStore()

export class MeasureService {
  constructor(
    private readonly measureRepository: IMeasureRepository,
    private readonly notificationService: INotificationService,
    private readonly assetStore: IAssetStore
  ) {}

  async fetchMeasure(id: string): Promise<IMeasure | null> {
    try {
    
      const measure = await this.measureRepository.findById(
        id,
        this.assetStore.assets
      )
      return measure
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch measure: ${error.message}`
          : 'Failed to fetch measure'
      this.notificationService.error(msg)
      return null
    }
  }

  async fetchMeasures(): Promise<IMeasure[]> {
    try {
      const measures = await this.measureRepository.findAll(
        this.assetStore.assets
      )
      return SharedAssetMapper.setParentNames(measures, assetStore.assets)
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to fetch measures: ${error.message}`
          : 'Failed to fetch measures'
      this.notificationService.error(msg)
      return []
    }
  }

  async createMeasure(data: IMeasure): Promise<boolean> {
    try {
      const errors = Measure.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      const measure = new Measure(data)
      await this.measureRepository.create(measure)
      this.notificationService.success('Measure created successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid measure data')
      } else {
        this.notificationService.error('Failed to create measure')
      }
      return false
    }
  }

  async updateMeasure(data: IMeasure): Promise<boolean> {
    try {
      const errors = Measure.validate(data)
      if (errors.hasErrors()) {
        const errorMessages = Object.values(errors).filter(Boolean)
        this.notificationService.error(errorMessages.join(', '))
        return false
      }

      const existingMeasure = await useMeasureStore().getMeasureById(data.id)

      if (!existingMeasure) throw new Error('Measure not found')

      const measure = new Measure({ ...existingMeasure, ...data })
      await this.measureRepository.update(measure)
      this.notificationService.success('Measure update successfully')
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.notificationService.error('Invalid measure data')
      } else {
        this.notificationService.error('Failed to update measure')
      }
      return false
    }
  }

  async deleteMeasure(id: string): Promise<void> {
    try {
      await this.measureRepository.delete(id)
      this.notificationService.success('Measure delete successfully')
    } catch (error) {
      const msg =
        error instanceof Error
          ? `Failed to delete measure: ${error.message}`
          : 'Failed to delete measure'
      this.notificationService.error(msg)
    }
  }
}
