export abstract class BaseRepository {
  protected baseUrl: string

  constructor(resource: string) {
    this.baseUrl = `${resource}`
  }
}
