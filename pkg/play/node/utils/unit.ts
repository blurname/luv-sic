const Byte = 1
const KiB = 1024 * Byte
const MiB = 1024 * KiB
const GiB = 1024 * MiB
const TiB = 1024 * GiB
const PiB = 1024 * TiB

type Unit = 'Bytes' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB'

type UnitResult =
  | { type: Unit; value: number }
  | { type: 'Unkown unit'; value: number }

const toUnit = (byte: number, unit: Unit): UnitResult => {
  // style1
  // if (unit === 'Bytes') return { type: 'Bytes', value: byte }
  // if (unit === 'KiB') return { type: 'KiB', value: byte / KiB }
  // if (unit === 'MiB') return { type: 'MiB', value: byte / MiB }
  // if (unit === 'GiB') return { type: 'GiB', value: byte / GiB }
  // if (unit === 'TiB') return { type: 'TiB', value: byte / TiB }
  // if (unit === 'PiB') return { type: 'PiB', value: byte / PiB }
  // return { type: 'Unkown unit', value: byte }

  // style2
  // switch (unit) {
  //   case 'Bytes': return { type: 'Bytes', value: byte }
  //   case 'KiB': return { type: 'KiB', value: byte / KiB }
  //   case 'MiB': return { type: 'MiB', value: byte / KiB }
  //   case 'GiB': return { type: 'GiB', value: byte / KiB }
  //   case 'TiB': return { type: 'TiB', value: byte / KiB }
  //   case 'PiB': return { type: 'PiB', value: byte / KiB }
  //   default: return { type: 'Unkown unit', value: byte }
  // }

  // style3: compared to style1 it has type guard
  if (unit === 'Bytes') return { type: 'Bytes', value: byte }
  else if (unit === 'KiB') return { type: 'KiB', value: byte / KiB }
  else if (unit === 'MiB') return { type: 'MiB', value: byte / MiB }
  else if (unit === 'GiB') return { type: 'GiB', value: byte / GiB }
  else if (unit === 'TiB') return { type: 'TiB', value: byte / TiB }
  else if (unit === 'PiB') return { type: 'PiB', value: byte / PiB }
  else return { type: 'Unkown unit', value: byte }
}

const getUnitFormat = (unitResult: UnitResult) => {
  if (unitResult.type === 'Unkown unit')
    return `Unkown uinit, ${unitResult.value}`
  return `${unitResult.value}${unitResult.type}`
}

for (const byte of [
  32 * Byte,
  64 * Byte,
  1 * KiB,
  4 * KiB,
  4096 * GiB,
  NaN,
  'abcde'
]) {
  try {
    if (typeof byte !== 'number') throw new Error('Error0: not a number')
    if (Number.isNaN(byte)) throw new Error('Error1: isNaN')
    console.log(
      getUnitFormat(toUnit(byte, 'Bytes')),
      getUnitFormat(toUnit(byte, 'KiB'))
    )
  } catch (e) {
    console.log((e as Error).message)
  }
}
