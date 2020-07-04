import { Maybe } from './types'

export interface RGB {
  r: number
  g: number
  b: number
  a?: number
}

export class RGBClass {
  public r: number
  public g: number
  public b: number
  public a?: number

  constructor(rgb: RGB) {
    this.r = rgb.r
    this.g = rgb.g
    this.b = rgb.b
    this.a = rgb.a && isNaN(rgb.a) ? undefined : rgb.a
  }

  public toCss(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a ?? 255})`
  }

  public toString(): string {
    return this.toCss()
  }
}

export type ColorArg = RGB | RGBClass | string

const reHexSimple = /^([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})/i
const reHexFull = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const reRgb = /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(\d+))?\)/

export function hexToRgb(hex: string): RGB {
  if (hex.startsWith('#')) {
    hex = hex.substr(1)
  }

  let values: Maybe<string[]>

  if (hex.length === 3) {
    const res = reHexSimple.exec(hex)

    if (res) {
      values = [
        `${res[1]}${res[1]}`,
        `${res[2]}${res[2]}`,
        `${res[3]}${res[3]}`,
        `ff`,
      ]
    }
  } else {
    const res = reHexFull.exec(hex)

    if (res) {
      values = [res[1], res[2], res[3], res[4] ?? 'ff']
    }
  }

  if (!values) {
    throw new Error(`Malformed hex value ${hex}`)
  }

  return {
    r: parseInt(values[0], 16),
    g: parseInt(values[1], 16),
    b: parseInt(values[2], 16),
    a: parseInt(values[3], 16),
  }
}

export function hexToRgbClass(hex: string): RGBClass {
  return new RGBClass(hexToRgb(hex))
}

export function hexToRgbCss(hex: string): string {
  return hexToRgbClass(hex).toCss()
}

export function shade(color: ColorArg, percent: number): RGBClass {
  percent = percent / 100

  if (typeof color === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const tmp = parseColor(color)

    if (!tmp) {
      throw new Error(`Unable to parse color ${color}`)
    }

    color = tmp
  }

  const t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = color.r,
    G = color.g,
    B = color.b

  return new RGBClass({
    r: Math.round((t - R) * p) + R,
    g: Math.round((t - G) * p) + G,
    b: Math.round((t - B) * p) + B,
    a: color.a,
  })
}

export function darken(color: ColorArg, percent: number): RGBClass {
  return shade(color, -percent)
}

export function lighten(color: ColorArg, percent: number): RGBClass {
  return shade(color, percent)
}

export function parseColor(c: string): Maybe<RGBClass> {
  if (c.startsWith('#') || reHexSimple.exec(c) || reHexFull.exec(c)) {
    return hexToRgbClass(c)
  } else {
    const m = reRgb.exec(c)
    console.log(`RGB:`, c, m)
    if (m) {
      return new RGBClass({
        r: parseInt(m[1], 10),
        g: parseInt(m[2], 10),
        b: parseInt(m[3], 10),
        a: parseInt(m[5], 10),
      })
    }
  }

  return undefined
}
