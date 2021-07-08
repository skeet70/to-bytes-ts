---
title: BytesEncodable.ts
nav_order: 2
parent: Modules
---

## BytesEncodable overview

The BytesEncodable type class represents types which can be converted into a
Uint8Array.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Combinators](#combinators)
  - [struct](#struct)
- [Instances](#instances)
  - [encodeInteger](#encodeinteger)
  - [encodeString](#encodestring)
- [Type aliases](#type-aliases)
  - [ByteMap (type alias)](#bytemap-type-alias)
- [Type classes](#type-classes)
  - [BytesEncodable (interface)](#bytesencodable-interface)
- [Utils](#utils)
  - [byteMap](#bytemap)

---

# Combinators

## struct

WARNING: EXPERIMENTAL.

If any property value is longer than 255 bytes, this will overflow and
decoding will break.

The current implementation uses a length marker byte before each property.

**Signature**

```ts
export declare const struct: <A>(
  encodes: { [K in keyof A]: BytesEncodable<A[K]> }
) => BytesEncodable<{ readonly [K in keyof A]: A[K] }>
```

Added in v1.0.0

# Instances

## encodeInteger

Encodes an integer as a byte array. Safe for integers in the range of
`-(2^53-1)` to `2^53-1`. Currently always a `Uint8Array(8)`.

**Signature**

```ts
export declare const encodeInteger: BytesEncodable<number>
```

Added in v1.0.0

## encodeString

Assumes utf-8 encoding.

**Signature**

```ts
export declare const encodeString: BytesEncodable<string>
```

Added in v1.0.0

# Type aliases

## ByteMap (type alias)

**Signature**

```ts
export type ByteMap<A> = { readonly [K in keyof A]: Uint8Array }
```

Added in v1.0.0

# Type classes

## BytesEncodable (interface)

**Signature**

```ts
export interface BytesEncodable<A> {
  readonly encode: (a: A) => Uint8Array
}
```

Added in v1.0.0

# Utils

## byteMap

Create a ByteMap of original key to byte encoded value from an object literal.

**Signature**

```ts
export declare const byteMap: <A>(encodes: { [K in keyof A]: BytesEncodable<A[K]> }) => (a: A) => ByteMap<A>
```

Added in v1.0.0
