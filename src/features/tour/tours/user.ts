// features/tour/tours/exampleTour.ts
import { ETourPlacement, type Tour } from '../domain/tour'

export const userTour: Tour = {
  id: 'user-tour',
  name: 'User Tour',
  description: 'User to Kowiste IoT Platform',
  steps: [
    {
      target: '#sidemenu-admin',
      title: 'Admin menu',
      content: 'Click here to open the user menu',
      placement: ETourPlacement.RIGHT,
      highlight: true,
      action: {
        type: 'click',
        delay: 100,
      },
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#sidemenu-admin-user',
      title: 'User button',
      content: 'Click here to go to the user page',
      placement: ETourPlacement.RIGHT,
      highlight: true,
      action: {
        type: 'click',
        delay: 500,
      },
      route: '/admin/user',
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#admin-user-add',
      title: 'add a user',
      content: 'Now lets going to add a user',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: 'click',
        delay: 1000,
      },
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#admin-user-form-name',
      title: 'write name',
      content: 'write the user name',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: 'input',
        value: 'testName',
        delay: 500,
      },
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#admin-user-form-lastname',
      title: 'write lastname',
      content: 'write the user lastname',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: 'input',
        value: 'testLastName',
        delay: 500,
      },
      waitForElement: true,
      waitForAction: false,
    },
    {
      target: '#admin-user-form-email',
      title: 'write email',
      content: 'write the user email',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: 'input',
        value: 'test@email.com',
        delay: 500,
      },
      waitForElement: true,
      waitForAction: false,
    },
  ],
  enabled: true,
  version: '1.0.0',
}
