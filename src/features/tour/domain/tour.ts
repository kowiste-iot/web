export interface TourStep {
  target: string
  content: string
  title?: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  route?: string
  waitForElement?: boolean
  action?: TourAction
  waitForAction?: boolean
  highlight?: boolean // Added for highlighting functionality
  field?: string // Added for form field targeting
  class?: string // Optional: for custom styling
  order?: number // Optional: for explicit ordering
  skipIfNotFound?: boolean // Optional: skip step if target not found
}

export interface TourAction {
  type: 'click' | 'input' | 'hover' | 'wait'
  value?: string
  delay?: number
  callback?: () => Promise<void> // Optional: custom action callback
}

export interface Tour {
  id: string
  name: string
  description: string
  steps: TourStep[]
  requiredTours?: string[]
  category?: string // Optional: for grouping tours
  version?: string // Optional: for tour versioning
  enabled?: boolean // Optional: to enable/disable tours
}

export interface TourProgress {
  tourId: string
  completed: boolean
  lastStepIndex: number
  startedAt: string
  completedAt?: string
  attempts?: number // Optional: track number of attempts
  failedSteps?: string[] // Optional: track problematic steps
}

export enum ETourPlacement {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left',
}

export enum ETourActionType {
  CLICK = 'click',
  INPUT = 'input',
  HOVER = 'hover',
  WAIT = 'wait',
}

// Optional: Validator class
export class TourValidator {
  static validateTour(tour: Tour): boolean {
    if (!tour.id || !tour.name || !tour.steps || !Array.isArray(tour.steps)) {
      return false
    }

    return tour.steps.every(
      (step) =>
        step.target &&
        typeof step.target === 'string' &&
        step.content &&
        typeof step.content === 'string'
    )
  }

  static validateTourProgress(progress: TourProgress): boolean {
    return (
      !!progress.tourId &&
      typeof progress.completed === 'boolean' &&
      typeof progress.lastStepIndex === 'number' &&
      progress.lastStepIndex >= 0 &&
      !!progress.startedAt
    )
  }
}
