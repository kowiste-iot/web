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
import type { ID } from '@/features/shared/domain/id'
import { ValidationError } from '@/features/shared/domain/baseValidator'

const assetStore = useAssetStore()

export class MeasureService {
  constructor(
    private readonly measureRepository: IMeasureRepository,
    private readonly notificationService: INotificationService,
    private readonly assetStore: IAssetStore
  ) {}

  async getMeasure(id: ID): Promise<IMeasure | null> {
    try {
      const measure = await this.measureRepository.findById(
        id,
        this.assetStore.assets
      )
      return measure
    } catch (error) {
      const errors = ValidationError.fromRequest<IMeasure>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to fetch measure: ' + errors.getError('gError')!
      )
      return null
    }
  }

  async getMeasures(): Promise<IMeasure[]> {
    try {
      const measures = await this.measureRepository.findAll(
        this.assetStore.assets
      )
      return SharedAssetMapper.setParentNames(measures, assetStore.assets)
    } catch (error) {
      const errors = ValidationError.fromRequest<IMeasure>(error)
      if (!errors.hasErrors()) return []
      this.notificationService.error(
        'Fail to fetch measures: ' + errors.getError('gError')!
      )
      return []
    }
  }

  async createMeasure(
    data: IMeasure
  ): Promise<ValidationError<IMeasure> | null> {
    try {
      const errors = Measure.validate(data)
      if (errors.hasErrors()) {
        return errors
      }
      const measure = new Measure(data)
      await this.measureRepository.create(measure)
      this.notificationService.success('Measure created successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IMeasure>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to create measure: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async updateMeasure(
    data: IMeasure
  ): Promise<ValidationError<IMeasure> | null> {
    try {
      const errors = Measure.validate(data)
      if (errors.hasErrors()) {
        return errors
      }

      const existingMeasure = await useMeasureStore().getMeasureById(data.id)

      if (!existingMeasure) throw new Error('Measure not found')

      const measure = new Measure({ ...existingMeasure, ...data })
      await this.measureRepository.update(measure)
      this.notificationService.success('Measure update successfully')
      return null
    } catch (error) {
      const errors = ValidationError.fromRequest<IMeasure>(error)
      if (!errors.hasErrors()) return null
      this.notificationService.error(
        'Fail to update measure: ' + errors.getError('gError')!
      )
      return errors
    }
  }

  async deleteMeasure(id: ID): Promise<void> {
    try {
      await this.measureRepository.delete(id)
      this.notificationService.success('Measure delete successfully')
    } catch (error) {
      const errors = ValidationError.fromRequest<IMeasure>(error)
      if (!errors.hasErrors()) return
      this.notificationService.error(
        'Fail to delete measure: ' + errors.getError('gError')!
      )
      return
    }
  }
}
