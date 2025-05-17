import {ETableLocation} from '@/features/shared/domain/ETableLocation'

export class Columns {
  public title: string
  public data: string
  public filter: boolean
  public sort: boolean
  public location: ETableLocation


  constructor(
    title: string = '',
    data: string = '',
    location: ETableLocation = ETableLocation.CENTER
  ) {
    this.title = title
    this.data = data
    this.location = location
    this.filter = false
    this.sort= false
  }
  addFilter(): Columns {
    this.filter = true
    return this
  }
  addSort(): Columns {
    this.sort = true
    return this
  }
}