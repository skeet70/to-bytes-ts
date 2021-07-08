/**
 * Base64 encode a Uint8Array
 *
 * @since 1.0.0
 */
export const encode = (array: Uint8Array): string => {
  let str = ''
  array.forEach((byte) => {
    str += String.fromCharCode(byte)
  })
  return btoa(encodeURIComponent(str))
}

/**
 * Base64 decode a string
 *
 * @since 1.0.0
 */
export const decode = (str: string): Uint8Array =>
  new Uint8Array(
    decodeURIComponent(atob(str))
      .split('')
      .map((c) => c.charCodeAt(0))
  )
