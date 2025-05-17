import type { NotificationService } from '@/features/notification/application/notificationService'
import { TourValidator, type Tour, type TourProgress } from '../domain/tour'
import type { TourRepository } from '../repository/tourRepository'

export class TourService {
  constructor(
    private repository: TourRepository,
    private notificationService: NotificationService
  ) {}

  async registerTour(tour: Tour) {
    try {
      if (!TourValidator.validateTour(tour)) {
        throw new Error(`Invalid tour definition: ${tour.id}`)
      }
      return tour
    } catch (error) {
      this.notificationService.error('Error registering tour')
      throw error
    }
  }

  async loadTours() {
    try {
      return await this.repository.loadTourDefinitions()
    } catch (error) {
      this.notificationService.error('Error loading tours')
      throw error
    }
  }

  async startTour(tourId: string) {
    try {
      // Add any start tour logic here
      this.notificationService.success('Tour started')
    } catch (error) {
      this.notificationService.error('Error starting tour')
      throw error
    }
  }

  async completeTour(tourId: string) {
    try {
      // Add any completion logic here
      this.notificationService.success('Tour completed')
    } catch (error) {
      this.notificationService.error('Error completing tour')
      throw error
    }
  }

  async saveTourProgress(progress: TourProgress[]) {
    try {
      await this.repository.saveProgress(progress)
    } catch (error) {
      this.notificationService.error('Error saving tour progress')
      throw error
    }
  }

  async loadTourProgress(): Promise<TourProgress[]> {
    try {
      return await this.repository.loadProgress()
    } catch (error) {
      this.notificationService.error('Error loading tour progress')
      throw error
    }
  }
  async resetTourProgress(tourId: string) {
    try {
      await this.repository.resetTourProgress(tourId)
      this.notificationService.success('Tour progress reset')
    } catch (error) {
      this.notificationService.error('Error resetting tour progress')
      throw error
    }
  }

  async resetAllProgress() {
    try {
      await this.repository.resetAllProgress()
      this.notificationService.success('All tour progress reset')
    } catch (error) {
      this.notificationService.error('Error resetting all progress')
      throw error
    }
  }

  async updateTourProgress(tourId: string, stepIndex: number) {
    try {
      await this.repository.updateTourProgress(tourId, stepIndex)
    } catch (error) {
      this.notificationService.error('Error updating tour progress')
      throw error
    }
  }
}
