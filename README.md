# to-bytes-ts

[![Test](http://github.com/skeet70/actions/workflows/build.yml/badge.svg)](http://github.com/skeet70/actions/workflows/build.yml)

[API Docs](https://skeet70.github.io/to-bytes-ts/)

---

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
- [Install](#install)
- [Examples](#examples)
  - [Strings](#strings)
  - [Numbers](#numbers)
  - [ByteMaps](#bytemaps)
  - [Custom](#custom)
<!-- AUTO-GENERATED-CONTENT:END -->

## Install

Uses `fp-ts` as a peer dependency.

```bash
yarn add fp-ts to-bytes-ts
```

or

```bash
npm install fp-ts to-bytes-ts
```

## Examples

All examples are compiled and executed and can be found in `./tests/examples.ts`.

### Strings

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./tests/examples.ts&lines=6-18) -->
<!-- The below code snippet is automatically added from ./tests/examples.ts -->
```ts
    const str = 'Hello World'

    // turn our utf-8 string into a byte array
    const bytes = BE.encodeString.encode(str)
    //> Uint8Array(11) [
    //>     72, 101, 108, 108,
    //>     111,  32,  87, 111,
    //>     114, 108, 100
    //>  ]

    // turn our byte array into a utf-8 string
    const decoded = BD.decodeString.decode(bytes)
    //> Hello World
```
<!-- AUTO-GENERATED-CONTENT:END -->

### Numbers

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./tests/examples.ts&lines=24-35) -->
<!-- The below code snippet is automatically added from ./tests/examples.ts -->
```ts
    const int = -21734897

    // turn our integer into a byte array
    const bytes = BE.encodeInteger.encode(int)
    //> Uint8Array(8) [
    //>     255,  0,   0,   0,
    //>     1, 75, 165, 241
    //> ]

    // turn our byte array into an integer
    const decoded = BD.decodeInteger.decode(bytes)
    //> -21734897
```
<!-- AUTO-GENERATED-CONTENT:END -->

### ByteMaps

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./tests/examples.ts&lines=41-83) -->
<!-- The below code snippet is automatically added from ./tests/examples.ts -->
```ts
    // an example of a database row you may want to be a bytemap (maybe for encryption)
    const row = {
      id: 499,
      name: 'John Doe',
      email: 'john.doe@example.com',
    }

    // specify how the fields should be encoded
    const rowEncoders = {
      id: BE.encodeInteger,
      name: BE.encodeString,
      email: BE.encodeString,
    }

    // turn our row into a bytemap
    const encodedRow = BE.byteMap(rowEncoders)(row)
    //> {
    //>    id: Uint8Array(8) [
    //>        0, 0, 0,   0,
    //>        0, 0, 1, 243
    //>      ],
    //>      name: Uint8Array(8) [
    //>        74, 111, 104, 110,
    //>        32,  68, 111, 101
    //>      ],
    //>      email: Uint8Array(20) [
    //>        106, 111, 104, 110,  46, 100,
    //>        111, 101,  64, 101, 120,  97,
    //>        109, 112, 108, 101,  46,  99,
    //>        111, 109
    //>      ]
    //> }

    // specify how the fields should be decoded
    const rowDecoders = {
      id: BD.decodeInteger,
      name: BD.decodeString,
      email: BD.decodeString,
    }

    // turn that bytemap back into a row
    const decodedRow = BD.byteMap(rowDecoders)(encodedRow)
    //> { id: 499, name: 'John Doe', email: 'john.doe@example.com' }
```
<!-- AUTO-GENERATED-CONTENT:END -->

### Custom

> WARNING: EXPERIMENTAL

The `struct` combinators available on `BytesEncodable` and `BytesDecodable` allow you to effectively derive an implementation for
a higher level object literal. As long as you have or can create an instance for all properties (including using `struct` for
sub-objects), you can use struct to create an instance for your current object as well.

This is currently experimental and fragile, but you can try it out and see if a roundtrip works for your objects.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./tests/examples.ts&lines=89-141) -->
<!-- The below code snippet is automatically added from ./tests/examples.ts -->
```ts
    const coat = {
      length: 'short',
      color: 'brown',
    }
    const cat = {
      id: 499,
      name: 'whiskers',
      breed: 'abyssinian',
      coat: coat,
    }

    // specify how the fields should be encoded
    const coatEncoder = BE.struct({
      length: BE.encodeString,
      color: BE.encodeString,
    })
    const catEncoder = BE.struct({
      id: BE.encodeInteger,
      name: BE.encodeString,
      breed: BE.encodeString,
      coat: coatEncoder,
    })

    // turn our cat into bytes
    const encodedCat = catEncoder.encode(cat)
    //> Uint8Array(42) [
    //>     8,   0,   0,   0,   0,   0,   0,   1, 243,
    //>     8, 119, 104, 105, 115, 107, 101, 114, 115,
    //>    10,  97,  98, 121, 115, 115, 105, 110, 105,
    //>    97, 110,  12,   5, 115, 104, 111, 114, 116,
    //>     5,  98, 114, 111, 119, 110
    //> ]

    // specify how the fields should be decoded
    const coatDecoder = BD.struct({
      length: BD.decodeString,
      color: BD.decodeString,
    })
    const catDecoder = BD.struct({
      id: BD.decodeInteger,
      name: BD.decodeString,
      breed: BD.decodeString,
      coat: coatDecoder,
    })

    // turn the bytes back into a cat
    const decodedCat = catDecoder.decode(encodedCat)
    //> {
    //>     id: 499,
    //>     name: 'whiskers',
    //>     breed: 'abyssinian',
    //>     coat: { length: 'short', color: 'brown' }
    //>  }
```
<!-- AUTO-GENERATED-CONTENT:END -->
