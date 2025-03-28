// features/tour/tours/exampleTour.ts
import { ETourActionType, ETourPlacement, type Tour } from '../domain/tour'

export const resourceTour: Tour = {
  id: 'resource-tour',
  name: 'Resource Tour',
  description: 'Resource to Kowiste IoT Platform',
  steps: [
    {
      target: '#menu-profile-button',
      title: 'User menu',
      content: 'Click here to open the user menu',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.CLICK,
        delay: 100,
      },
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#menu-tour',
      title: 'Tour button',
      content: 'Click here to open tour progress',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.CLICK,
        delay: 500,
      },
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#tour-card',
      title: 'Tour Progress',
      content:
        'Here you can see your tour progress or select one topic to learn more about',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.WAIT,
        delay: 500,
      },
      waitForElement: true,
      waitForAction: false,
    },
  ],
  enabled: true,
  version: '1.0.0',
}
