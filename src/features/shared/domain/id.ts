export type ID = string

/**
 * Type guard to check if an object has an ID
 */
export function hasID(obj: unknown): obj is { id: ID } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof (obj as { id: ID }).id === 'string'
  )
}

