const itemsToRemove = ['admin']

export interface ISession {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  roles: string[]
  branches: string[]
  preferences: {
    theme?: string
    language?: string
    notifications?: {
      email: boolean
      push: boolean
    }
  }
  settings: {
    defaultView?: string
    timezone?: string
    currentBranch?: string
  }
}

export class Session implements ISession {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  roles: string[]
  branches: string[]
  preferences: {
    theme?: string
    language?: string
    notifications?: {
      email: boolean
      push: boolean
    }
  }
  settings: {
    defaultView?: string
    timezone?: string
  }

  constructor(props: ISession) {
    this.id = props.id
    this.firstName = props.firstName
    this.lastName = props.lastName
    this.fullName = props.lastName + ' ' + props.firstName
    this.email = props.email
    this.roles = props.roles
    this.branches = props.branches
    this.preferences = props.preferences
    this.settings = props.settings

    this.branches = this.branches?.filter(
      (branch) => !itemsToRemove.includes(branch)
    )
  }

  toJSON(): ISession {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      email: this.email,
      roles: this.roles,
      branches: this.branches,
      preferences: this.preferences,
      settings: this.settings,
    }
  }
}

export interface ISessionRepository {
  updatePreferences(
    id: string,
    preferences: ISession['preferences']
  ): Promise<void>
  updateSettings(id: string, settings: ISession['settings']): Promise<void>
}
