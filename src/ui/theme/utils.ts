import { RGB, RGBClass, parseColor } from '../../lib/colors'

type CSSValueType = string | RGB | RGBClass | number | undefined

export class CSSValue {
  public value: CSSValueType

  constructor(value: CSSValueType) {
    this.value = value
  }

  isUndefined(): boolean {
    return this.value === undefined
  }

  toString(): string {
    if (this.value !== undefined) {
      return this.value.toString()
    }

    return ''
  }
}

class CSSUnitValue extends CSSValue {
  public unit = 'px'

  constructor(value: CSSValueType, unit?: string) {
    super(value)

    if (unit) {
      this.unit = unit
    }
  }

  toString(): string {
    return super.toString() + this.unit
  }
}

export function cssValue(value: CSSValueType): CSSValue {
  return new CSSValue(value)
}

export function cssUnitValue(value: CSSValueType, unit?: string): CSSUnitValue {
  return new CSSUnitValue(value, unit)
}

export function cssRGBValue(rgb: RGB): CSSValue {
  return new CSSValue(new RGBClass(rgb))
}

export function cssColor(c: string): CSSValue {
  const p = parseColor(c)

  if (p) {
    return new CSSValue(p)
  } else {
    return new CSSValue(c)
  }
}
