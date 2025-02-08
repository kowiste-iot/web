// features/tour/stores/useTourStore.ts
import { defineStore } from 'pinia'
import { NotificationService } from '@/features/notification/application/notificationService'
import { useNotificationStore } from '@/features/notification/stores/notificationStore'
import type { Tour, TourProgress, TourStep } from '../domain/tour'
import { TourRepository } from '../repository/tourRepository'
import { TourService } from '../application/tourService'

export const useTourStore = defineStore('tourStore', {
  state: () => ({
    tours: {} as Record<string, Tour>,
    currentTourId: null as string | null,
    currentStepIndex: 0,
    isVisible: false,
    progress: [] as TourProgress[],
    hasInitialized: false,
  }),

  getters: {
    currentTour: (state): Tour | null => {
      return state.currentTourId ? state.tours[state.currentTourId] : null
    },

    currentStep: (state): TourStep | null => {
      const tour = state.currentTourId ? state.tours[state.currentTourId] : null
      return tour ? tour.steps[state.currentStepIndex] : null
    },

    tourProgress: (state): Record<string, TourProgress> => {
      return state.progress.reduce((acc, curr) => {
        acc[curr.tourId] = curr
        return acc
      }, {} as Record<string, TourProgress>)
    },

    completedTours: (state): string[] => {
      return state.progress.filter((p) => p.completed).map((p) => p.tourId)
    },

    availableTours: (state): Tour[] => {
      return Object.values(state.tours).filter((tour) => {
        if (!tour.requiredTours?.length) return true
        return tour.requiredTours.every((reqTourId) =>
          state.progress.some((p) => p.tourId === reqTourId && p.completed)
        )
      })
    },

    getTourCompletion: (state) => {
      return (tourId: string): number => {
        const tourProg = state.progress.find((p) => p.tourId === tourId)
        if (!tourProg) return 0
        if (tourProg.completed) return 100

        const totalSteps = state.tours[tourId]?.steps.length || 0
        if (!totalSteps) return 0

        return Math.round((tourProg.lastStepIndex / totalSteps) * 100)
      }
    },
  },

  actions: {
    async registerTour(tour: Tour) {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )
      await tourService.registerTour(tour)
      this.tours[tour.id] = tour
    },

    async startTour(tourId: string) {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      try {
        if (!this.tours[tourId]) {
          throw new Error(`Tour ${tourId} not found`)
        }

        const tour = this.tours[tourId]
        if (tour.requiredTours?.length) {
          const missingTours = tour.requiredTours.filter(
            (reqTourId) => !this.completedTours.includes(reqTourId)
          )
          if (missingTours.length) {
            throw new Error(
              `Required tours not completed: ${missingTours.join(', ')}`
            )
          }
        }

        await tourService.startTour(tourId)

        this.currentTourId = tourId
        this.currentStepIndex = 0
        this.isVisible = true

        const existingProgress = this.progress.find((p) => p.tourId === tourId)
        if (!existingProgress) {
          this.progress.push({
            tourId,
            completed: false,
            lastStepIndex: 0,
            startedAt: new Date().toISOString(),
          })
        }

        await this.saveProgress()
      } catch (error) {
        throw error
      }
    },

    async nextStep() {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      if (!this.currentTour) return

      if (this.currentStepIndex < this.currentTour.steps.length - 1) {
        this.currentStepIndex++
        await this.updateProgress()
      } else {
        await this.completeTour()
      }

      await tourService.updateTourProgress(
        this.currentTourId!,
        this.currentStepIndex
      )
    },

    async previousStep() {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      if (this.currentStepIndex > 0) {
        this.currentStepIndex--
        await this.updateProgress()
      }

      await tourService.updateTourProgress(
        this.currentTourId!,
        this.currentStepIndex
      )
    },

    async updateProgress() {
      if (!this.currentTourId) return

      const progressIndex = this.progress.findIndex(
        (p) => p.tourId === this.currentTourId
      )

      if (progressIndex !== -1) {
        this.progress[progressIndex] = {
          ...this.progress[progressIndex],
          lastStepIndex: this.currentStepIndex,
        }
      }

      await this.saveProgress()
    },

    async completeTour() {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      if (!this.currentTourId) return

      const progressIndex = this.progress.findIndex(
        (p) => p.tourId === this.currentTourId
      )

      if (progressIndex !== -1) {
        this.progress[progressIndex] = {
          ...this.progress[progressIndex],
          completed: true,
          lastStepIndex: this.currentTour?.steps.length ?? 0,
          completedAt: new Date().toISOString(),
        }
      }

      await tourService.completeTour(this.currentTourId)
      await this.saveProgress()
      this.endTour()
    },

    endTour() {
      this.isVisible = false
      this.currentTourId = null
      this.currentStepIndex = 0
    },

    async resetTourProgress(tourId: string) {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      const progressIndex = this.progress.findIndex((p) => p.tourId === tourId)
      if (progressIndex !== -1) {
        this.progress.splice(progressIndex, 1)
        await this.saveProgress()
      }

      await tourService.resetTourProgress(tourId)
    },

    async resetAllProgress() {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      this.progress = []
      await this.saveProgress()
      await tourService.resetAllProgress()
    },

    async saveProgress() {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      try {
        await tourService.saveTourProgress(this.progress)
        localStorage.setItem('tourProgress', JSON.stringify(this.progress))
      } catch (error) {
        throw error
      }
    },

    async loadProgress() {
      const tourService = new TourService(
        new TourRepository(),
        new NotificationService(useNotificationStore())
      )

      if (this.hasInitialized) return

      try {
        const savedProgress = await tourService.loadTourProgress()
        this.progress = savedProgress
        this.hasInitialized = true
      } catch (error) {
        throw error
      }
    },
  },
})
