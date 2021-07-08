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

- [Instances](#instances)
  - [decodeInteger](#decodeinteger)
  - [decodeString](#decodestring)
- [Type classes](#type-classes)
  - [BytesDecodable (interface)](#bytesdecodable-interface)
- [Utils](#utils)
  - [byteMap](#bytemap)

---

# Instances

## decodeInteger

Decodes a byte array into an integer. Safe for integers in the range of
-(2^53-1) to 2^53-1. Only length 8 Uint8Arrays are valid right now.

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

Create a ByteMap of original key to byte decoded value from an object literal.

**Signature**

```ts
export declare const byteMap: <A>(decodes: { [K in keyof A]: BytesDecodable<A[K]> }) => (a: ByteMap<A>) => A
```

Added in v1.0.0
