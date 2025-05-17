import type { Tour, TourProgress } from '../domain/tour'

export class TourRepository {
  async loadTourDefinitions() {
    // Dynamically import all tour files from /tours folder
    const tourModules = import.meta.glob('../tours/*.ts', { eager: true })
    const tours: Tour[] = []

    for (const path in tourModules) {
      const module = tourModules[path] as any
      if (module.default) {
        tours.push(module.default)
      }
    }

    return tours
  }

  async saveProgress(progress: TourProgress[]) {
    localStorage.setItem('tourProgress', JSON.stringify(progress))
  }

  async loadProgress(): Promise<TourProgress[]> {
    const saved = localStorage.getItem('tourProgress')
    return saved ? JSON.parse(saved) : []
  }
  async resetTourProgress(tourId: string) {
    const saved = await this.loadProgress()
    const filtered = saved.filter((p) => p.tourId !== tourId)
    await this.saveProgress(filtered)
  }

  async resetAllProgress() {
    await this.saveProgress([])
  }

  async updateTourProgress(tourId: string, stepIndex: number) {
    const saved = await this.loadProgress()
    const index = saved.findIndex((p) => p.tourId === tourId)

    if (index !== -1) {
      saved[index].lastStepIndex = stepIndex
      await this.saveProgress(saved)
    }
  }
}
