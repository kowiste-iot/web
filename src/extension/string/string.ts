declare global {
  interface String {
    /**
     * Check if string is empty
     * @returns return true if empty
     */
    isEmpty(): boolean
  }
}
// Convert from browser timezone to organization timezone

String.prototype.isEmpty = function (): boolean {
  if (!this || this == undefined || this == null) return true
  return false
}

export {}
