import type { Path } from "@/model/path"

export abstract class PageBase {
  title: string
  path: Path[]
  constructor(title: string, path: Path[]) {
    this.title = title
    this.path = path
  }
}
