export class URLParams {
  private query: URLSearchParams
  constructor() {
    this.query = new URLSearchParams()
  }
  setParams(field: string, data: string) {
    this.query.append(field, data)
  }
  setURL(url: string): string {
    if (url.includes('?')) {
      return`${url}&${this.query.toString()}`
    }
    return `${url}?${this.query.toString()}`
  }

}
