import type { RGB } from '../../lib/colors'
import { RGBClass, parseColor } from '../../lib/colors'

type CssValueType = string | RGB | RGBClass | number | undefined

export class CssValue {
  public value: CssValueType

  constructor(value: CssValueType) {
    this.value = value
  }

  public isUndefined(): boolean {
    return this.value === undefined
  }

  public toString(): string {
    if (this.value !== undefined) {
      return this.value.toString()
    }

    return ''
  }
}

class CssUnitValue extends CssValue {
  public unit = 'px'

  constructor(value: CssValueType, unit?: string) {
    super(value)

    if (unit) {
      this.unit = unit
    }
  }

  public toString(): string {
    return super.toString() + this.unit
  }
}

export function cssValue(value: CssValueType): CssValue {
  return new CssValue(value)
}

export function cssUnitValue(value: CssValueType, unit?: string): CssUnitValue {
  return new CssUnitValue(value, unit)
}

export function cssRGBValue(rgb: RGB): CssValue {
  return new CssValue(new RGBClass(rgb))
}

export function cssColor(c: string): CssValue {
  const p = parseColor(c)

  if (p) {
    return new CssValue(p)
  } else {
    return new CssValue(c)
  }
}
