export function getParam(param: string | string[]): string {
  if (typeof param === 'string') {
    return param
  } else if (Array.isArray(param) && param.length > 0) {
    return param[0]
  }
  // Handle other cases, such as empty array or unexpected types
  return ''
}
