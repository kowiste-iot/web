// features/tour/tours/exampleTour.ts
import { ETourPlacement, type Tour } from '../domain/tour'

export const exampleTour: Tour = {
  id: 'example-tour',
  name: 'Calendar Tour',
  description: 'Learn how to use the calendar component',
  steps: [
    {
      target: '.date-picker .date-input',
      title: 'Date Selection',
      content: 'Click here to open the calendar',
      placement: ETourPlacement.RIGHT,
      highlight: true,
      action: {
        type: 'click',
        delay: 500,
      },
      waitForElement: true,
      waitForAction: true,
    },
    {
      target: '.calendar-header',
      title: 'Calendar Navigation',
      content: 'Use these controls to navigate between months',
      placement: ETourPlacement.TOP,
      highlight: true,
      waitForElement: true,
    },
    {
      target: '.calendar-days',
      title: 'Date Selection',
      content: 'Click and drag to select a date range',
      placement: ETourPlacement.RIGHT,
      highlight: true,
      waitForElement: true,
    },
    {
      target: '.calendar-date:not(.disabled):not(.other-month)',
      title: 'Select Date',
      content: 'Click on a date to select it',
      placement: ETourPlacement.RIGHT,
      highlight: true,
      action: {
        type: 'click',
        delay: 500,
      },
      waitForElement: true,
      waitForAction: true,
    },
    {
      target: 'img[src*="/assets/logo.png"]',
      title: 'Our Logo',
      content: 'This is our company logo',
      placement: ETourPlacement.TOP,
      highlight: true,
      waitForElement: true,
    },
    {
      target: 'button:has-text("Follow")',
      title: 'Follow Button',
      content: 'Click this button to stay updated',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: 'click',
        delay: 500,
      },
      waitForElement: true,
      waitForAction: true,
    },
  ],
  enabled: true,
  version: '1.0.0',
}
