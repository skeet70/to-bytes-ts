/**
 * The BytesEncodable type class represents types which can be converted into a
 * Uint8Array.
 *
 * @since 1.0.0
 */

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------
/**
 * @since 1.0.0
 * @category Type classes
 */
export interface BytesEncodable<A> {
  readonly encode: (a: A) => Uint8Array
}

/**
 * @since 1.0.0
 * @category Type aliases
 */
export type ByteMap<A> = { readonly [K in keyof A]: Uint8Array }

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------
/**
 * WARNING: EXPERIMENTAL.
 *
 * If any property value is longer than 255 bytes, this will overflow and
 * decoding will break.
 *
 * The current implementation uses a length marker byte before each property.
 *
 * @since 1.0.0
 * @category Combinators
 */
// this can only work if the byte length of a sub element is less than 255...
// definitely won't work recursively for a lot of literals.
// could be a version that works of sizes are static and can be defined for the type?
// not super useful though
export const struct = <A>(
  encodes: { [K in keyof A]: BytesEncodable<A[K]> }
): BytesEncodable<{ readonly [K in keyof A]: A[K] }> => ({
  encode: (a) => {
    let result = new Uint8Array()
    for (const k in encodes) {
      if (Object.hasOwnProperty.call(encodes, k)) {
        const encodedA = encodes[k].encode(a[k])
        const elementLength = encodedA.length
        result = new Uint8Array([...result, elementLength, ...encodedA])
      }
    }
    return result
  },
})

// -----------------------------------------------------------------------------
// instances
// -----------------------------------------------------------------------------
/**
 * Assumes utf-8 encoding.
 *
 * @since 1.0.0
 * @category Instances
 */
export const encodeString: BytesEncodable<string> = {
  encode: (a: string) => new TextEncoder().encode(a),
}

/**
 * Encodes an integer as a byte array. Safe for integers in the range of
 * `-(2^53-1)` to `2^53-1`. Currently always a `Uint8Array(8)`.
 *
 * @since 1.0.0
 * @category Instances
 */
// TODO: look into using a range type of some sort here instead of number
// TODO: look into chopping 0 values off the middle of the array to save space
export const encodeInteger: BytesEncodable<number> = {
  encode: (a: number) => {
    if (a < Number.MIN_SAFE_INTEGER || a > Number.MAX_SAFE_INTEGER) {
      throw new RangeError(`${a} is out of safe Javascript Integer range.`)
    }

    const bytes = new Uint8Array(8)
    if (a < 0) {
      bytes[0] = 0xff
      a = Math.abs(a)
    }

    // we don't want touch the 0th index since that's the sign byte
    for (let i = 7; i > 0; i--) {
      if (a <= 0) {
        break
      }
      bytes[i] = a % 256
      a = Math.trunc(a / 256)
    }
    return bytes
  },
}

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------
/**
 * Create a ByteMap of original key to byte encoded value from an object literal.
 *
 * @since 1.0.0
 * @category Utils
 */
export const byteMap =
  <A>(
    encodes: { [K in keyof A]: BytesEncodable<A[K]> }
  ): ((a: A) => ByteMap<A>) =>
  (a: A) => {
    const b: Partial<ByteMap<A>> = {}
    for (const k in encodes) {
      b[k] = encodes[k].encode(a[k])
    }

    // now that we've iterated over all properties, we can safely cast
    // the result to a non-partial version of the type
    return b as ByteMap<A>
  }
