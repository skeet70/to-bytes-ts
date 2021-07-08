import * as _ from '../src/BytesDecodable'

describe('BytesDecodable', () => {
  it('decodeString', () => {
    expect(
      _.decodeString.decode(new Uint8Array([116, 101, 115, 116]))
    ).toStrictEqual('test')

    expect(
      _.decodeString.decode(
        new Uint8Array([206, 186, 225, 189, 185, 207, 131, 206, 188, 206, 181])
      )
    ).toStrictEqual('κόσμε')
  })

  it('decodeInteger', () => {
    const overMaxInt = () =>
      _.decodeInteger.decode(
        new Uint8Array([0, 32, 255, 255, 255, 255, 255, 255])
      )
    const underMinInt = () =>
      _.decodeInteger.decode(
        new Uint8Array([255, 32, 255, 255, 255, 255, 255, 255])
      )
    expect(overMaxInt).toThrow(RangeError)
    expect(underMinInt).toThrow(RangeError)
    const tooLong = () =>
      _.decodeInteger.decode(
        new Uint8Array([1, 255, 31, 255, 255, 255, 255, 255, 255])
      )
    const tooShort = () =>
      _.decodeInteger.decode(new Uint8Array([31, 255, 255, 255, 255, 255, 255]))
    expect(tooLong).toThrow(RangeError)
    expect(tooShort).toThrow(RangeError)
    expect(
      _.decodeInteger.decode(
        new Uint8Array([0, 31, 255, 255, 255, 255, 255, 255])
      )
    ).toStrictEqual(Number.MAX_SAFE_INTEGER)
    expect(
      _.decodeInteger.decode(
        new Uint8Array([255, 31, 255, 255, 255, 255, 255, 255])
      )
    ).toStrictEqual(Number.MIN_SAFE_INTEGER)
  })

  it('byteMap', () => {
    const expectedResult = {
      greeting: 'Hello',
      total: 2002123,
    }

    const decoders = {
      greeting: _.decodeString,
      total: _.decodeInteger,
    }

    const testObj = {
      greeting: new Uint8Array([72, 101, 108, 108, 111]),
      total: new Uint8Array([0, 0, 0, 0, 0, 30, 140, 203]),
    }

    expect(_.byteMap(decoders)(testObj)).toStrictEqual(expectedResult)
  })
})
