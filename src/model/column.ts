import {ETableLocation} from '@/enums/ETableLocation'

export class Columns {
  public title: string
  public data: string
  public filter: boolean
  public sort: boolean
  public location: ETableLocation
  public dbName: string

  constructor(
    title: string = '',
    data: string = '',
    location: ETableLocation = ETableLocation.CENTER
  ) {
    this.title = title
    this.data = data
    this.location = location
    this.dbName = ''
    this.filter = false
    this.sort= false
  }
  addDBName(name: string): Columns {
    this.dbName = name
    return this
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