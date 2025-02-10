// features/tour/tours/exampleTour.ts
import { ETourActionType, ETourPlacement, type Tour } from '../domain/tour'

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
        type: ETourActionType.CLICK,
        delay: 100,
      },
      waitForElement: true,
    },
    {
      target: '#sidemenu-admin-user',
      title: 'User button',
      content: 'Click here to go to the user page',
      placement: ETourPlacement.RIGHT,
      highlight: true,
      action: {
        type: ETourActionType.CLICK,
        delay: 500,
      },
      route: '/admin/user',
      waitForElement: true,
    },
    {
      target: '#admin-user-add',
      title: 'add a user',
      content: 'Now lets going to add a user',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.CLICK,
        delay: 1000,
      },
      postActionWait: {
        duration: 1000,
      },
      waitForElement: true,
    },
    {
      target: '#admin-user-form-name > input',
      class: 'form-control',
      title: 'write name',
      content: 'write the user name',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.INPUT,
        value: 'testName',
        delay: 500,
      },
      waitForElement: true,
    },
    {
      target: '#admin-user-form-lastname > input',
      title: 'write lastname',
      content: 'write the user lastname',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.INPUT,
        value: 'testLastName',
        delay: 500,
      },
      waitForElement: true,
    },
    {
      target: '#admin-user-form-email > input',
      title: 'write email',
      content: 'write the user email',
      placement: ETourPlacement.LEFT,
      highlight: true,
      action: {
        type: ETourActionType.INPUT,
        value: 'test@email.com',
        delay: 500,
      },
      waitForElement: true,
    },
    {
      target: '#admin-user-form-save',
      title: 'press save',
      content: 'save the user',
      placement: ETourPlacement.TOP,
      highlight: true,
      action: {
        type: ETourActionType.CLICK,
        delay: 500,
      },
      waitForElement: true,
    },
    {
      target: '#admin-user-form-save',
      title: 'Finish',
      content: 'end create user',
      placement: ETourPlacement.TOP,
      waitForElement: true,
    },
  ],
  enabled: true,
  version: '1.0.0',
}
