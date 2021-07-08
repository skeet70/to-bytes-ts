/**
 * The BytesDecodable type class represents types which can be converted from a
 * Uint8Array.
 *
 * @since 1.0.0
 */

import { ByteMap } from './BytesEncodable'

// -----------------------------------------------------------------------------
// model
// -----------------------------------------------------------------------------
/**
 * @since 1.0.0
 * @category Type classes
 */
export interface BytesDecodable<A> {
  readonly decode: (a: Uint8Array) => A
}

// -----------------------------------------------------------------------------
// combinators
// -----------------------------------------------------------------------------
/**
 * WARNING: EXPERIMENTAL.
 *
 * The current implementation makes a lot of assumptions:
 *
 *      * that the decoder field order is the same as the encoder field order,
 *      * that the field lengths are `255` or under,
 *      * that all indicies in the provided byte array are `!undefined`
 *
 * If any of the above assumptions are broken, the resulting behavior is undefined.
 *
 * @since 1.0.0
 * @category Combinators
 */
// this can only work if the type sizes are constant or known at decode time...
// not sure how to make sure of that, or create a better way to do it
export const struct = <A>(
  decodes: { [K in keyof A]: BytesDecodable<A[K]> }
): BytesDecodable<{ readonly [K in keyof A]: A[K] }> => ({
  decode: (a: Uint8Array) => {
    const result: Partial<{ readonly [K in keyof A]: A[K] }> = {}
    // assumes same order of keys as encodes (which isn't always the case)
    for (const k in decodes) {
      if (Object.hasOwnProperty.call(decodes, k)) {
        // TODO: make sure all the elements are defined
        const propertyLength = a[0] || 0

        result[k] = decodes[k].decode(a.subarray(1, propertyLength + 1))
        a = a.slice(propertyLength + 1)
      }
    }
    // now that we've iterated over all the keys, we can cast the result
    return result as { readonly [K in keyof A]: A[K] }
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
export const decodeString: BytesDecodable<string> = {
  decode: (a: Uint8Array) => new TextDecoder().decode(a),
}

/**
 * Decodes a byte array into an integer. Safe for integers in the range of
 * `-(2^53-1)` to `2^53-1`. Only length 8 `Uint8Array`s are valid right now.
 *
 * @since 1.0.0
 * @category Instances
 */
// TODO: look into using a range type of some sort here instead of number
export const decodeInteger: BytesDecodable<number> = {
  decode: (a: Uint8Array) => {
    if (a.length !== 8 || (a[1] && a[1] > 31)) {
      throw new RangeError(
        `${a} cannot be within safe Javascript Integer range.`
      )
    }

    const unsigned = a.subarray(1, 8).reduce((x, acc) => acc + x * 256, 0)
    return a[0] === 0x00 ? unsigned : -unsigned
  },
}

// decode a Uint8Array into an integer

// -----------------------------------------------------------------------------
// utils
// -----------------------------------------------------------------------------
/**
 * Create a `ByteMap` of original key to byte decoded value from an object literal.
 *
 * @since 1.0.0
 * @category Utils
 */
export const byteMap =
  <A>(
    decodes: { [K in keyof A]: BytesDecodable<A[K]> }
  ): ((a: ByteMap<A>) => A) =>
  (a: ByteMap<A>) => {
    const b: Partial<A> = {}
    for (const k in decodes) {
      b[k] = decodes[k].decode(a[k])
    }

    // now that we've iterated over all properties, we can safely cast
    // the result to a non-partial version of the type
    return b as A
  }
