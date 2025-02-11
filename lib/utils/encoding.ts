export const encodeBase64 = (str: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64')
  }
  return btoa(str)
}

export const decodeBase64 = (str: string): string => {
  if (typeof window === 'undefined') {
    return Buffer.from(str, 'base64').toString()
  }
  return atob(str)
}