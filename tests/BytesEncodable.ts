import * as _ from '../src/BytesEncodable'

describe('BytesEncodable', () => {
  it('encodeString', () => {
    expect(_.encodeString.encode('test')).toStrictEqual(
      new Uint8Array([116, 101, 115, 116])
    )

    expect(_.encodeString.encode('κόσμε')).toStrictEqual(
      new Uint8Array([206, 186, 225, 189, 185, 207, 131, 206, 188, 206, 181])
    )
  })

  it('encodeInteger', () => {
    const overMaxInt = () => _.encodeInteger.encode(Number.MAX_SAFE_INTEGER + 1)
    const underMinInt = () =>
      _.encodeInteger.encode(Number.MIN_SAFE_INTEGER - 1)
    expect(overMaxInt).toThrow(RangeError)
    expect(underMinInt).toThrow(RangeError)
    expect(_.encodeInteger.encode(Number.MAX_SAFE_INTEGER)).toStrictEqual(
      new Uint8Array([0, 31, 255, 255, 255, 255, 255, 255])
    )
    expect(_.encodeInteger.encode(Number.MIN_SAFE_INTEGER)).toStrictEqual(
      new Uint8Array([255, 31, 255, 255, 255, 255, 255, 255])
    )
  })

  it('byteMap', () => {
    const testObj = {
      greeting: 'Hello',
      total: 2002123,
    }

    const encoders = {
      greeting: _.encodeString,
      total: _.encodeInteger,
    }

    const expectedResult = {
      greeting: new Uint8Array([72, 101, 108, 108, 111]),
      total: new Uint8Array([0, 0, 0, 0, 0, 30, 140, 203]),
    }

    expect(_.byteMap(encoders)(testObj)).toStrictEqual(expectedResult)
  })

  it('drops un-encoded fields', () => {
    const testObj = {
      greeting: 'Hello',
      total: 2002123,
    }

    const encoders = {
      total: _.encodeInteger,
    }

    const expectedResult = {
      total: new Uint8Array([0, 0, 0, 0, 0, 30, 140, 203]),
    }

    expect(_.byteMap(encoders)(testObj)).toStrictEqual(expectedResult)
  })
})
