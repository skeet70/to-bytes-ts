---
title: BytesDecodable.ts
nav_order: 1
parent: Modules
---

## BytesDecodable overview

The BytesDecodable type class represents types which can be converted from a
Uint8Array.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [struct](#struct)
- [Instances](#instances)
  - [decodeInteger](#decodeinteger)
  - [decodeString](#decodestring)
- [Type classes](#type-classes)
  - [BytesDecodable (interface)](#bytesdecodable-interface)
- [Utils](#utils)
  - [byteMap](#bytemap)

---

# Combinators

## struct

WARNING: EXPERIMENTAL.

The current implementation makes a lot of assumptions:

     * that the decoder field order is the same as the encoder field order,
     * that the field lengths are `255` or under,
     * that all indicies in the provided byte array are `!undefined`

If any of the above assumptions are broken, the resulting behavior is undefined.

**Signature**

```ts
export declare const struct: <A>(
  decodes: { [K in keyof A]: BytesDecodable<A[K]> }
) => BytesDecodable<{ readonly [K in keyof A]: A[K] }>
```

Added in v1.0.0

# Instances

## decodeInteger

Decodes a byte array into an integer. Safe for integers in the range of
`-(2^53-1)` to `2^53-1`. Only length 8 `Uint8Array`s are valid right now.

**Signature**

```ts
export declare const decodeInteger: BytesDecodable<number>
```

Added in v1.0.0

## decodeString

Assumes utf-8 encoding.

**Signature**

```ts
export declare const decodeString: BytesDecodable<string>
```

Added in v1.0.0

# Type classes

## BytesDecodable (interface)

**Signature**

```ts
export interface BytesDecodable<A> {
  readonly decode: (a: Uint8Array) => A
}
```

Added in v1.0.0

# Utils

## byteMap

Create a `ByteMap` of original key to byte decoded value from an object literal.

**Signature**

```ts
export declare const byteMap: <A>(decodes: { [K in keyof A]: BytesDecodable<A[K]> }) => (a: ByteMap<A>) => A
```

Added in v1.0.0
