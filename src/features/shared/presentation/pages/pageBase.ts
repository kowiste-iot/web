import type { Path } from '@/model/path'

export abstract class PageBase {
  title: string
  path: Path[]
  constructor(title: string, path: Path[]) {
    this.title = title
    this.path = path
  }
}

export class Page extends PageBase {
  constructor(title: string, path?: Path[]) {
    super(title, path ? path : new Array<Path>())
  }
}
