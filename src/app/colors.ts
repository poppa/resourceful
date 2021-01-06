import { nativeTheme, systemPreferences } from 'electron'
import { hexToRgbCss } from '../lib/colors'
import { EventEmitter } from 'events'

export interface SystemColors {
  isDarkMode: boolean
  background: string
  foreground: string
  blue: string
  brown: string
  gray: string
  green: string
  orange: string
  pink: string
  purple: string
  red: string
  yellow: string
  accent: string
}

export interface Colors {
  on(event: 'updated', fn: VoidFunction): this
}

export class Colors extends EventEmitter implements SystemColors {
  constructor() {
    super()
    nativeTheme.on('updated', () => this.emit('updated'))
  }

  public get isDarkMode(): boolean {
    return nativeTheme.shouldUseDarkColors
  }

  public get background(): string {
    return hexToRgbCss(systemPreferences.getColor('under-page-background'))
  }

  public get foreground(): string {
    return hexToRgbCss(systemPreferences.getColor('text'))
  }

  public get blue(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('blue'))
  }

  public get brown(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('brown'))
  }

  public get gray(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('gray'))
  }

  public get green(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('green'))
  }

  public get orange(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('orange'))
  }

  public get pink(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('pink'))
  }

  public get purple(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('purple'))
  }

  public get red(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('red'))
  }

  public get yellow(): string {
    return hexToRgbCss(systemPreferences.getSystemColor('yellow'))
  }

  public get accent(): string {
    return hexToRgbCss(systemPreferences.getAccentColor())
  }

  public [Symbol.toPrimitive](hint: string): unknown {
    console.log(`Primitive hint:`, hint)
    switch (hint) {
      case 'number':
        return Object.keys(this.toPlainObject()).length

      case 'string':
        return JSON.stringify(this.toPlainObject())

      default:
        // Do nothing
        break
    }

    return this.toPlainObject()
  }

  public toPlainObject(): SystemColors {
    const tmp: Partial<SystemColors> = {}
    const proto = Reflect.getPrototypeOf(this)

    for (const p of Object.getOwnPropertyNames(proto)) {
      try {
        const res = Reflect.get(this, p)
        if (['string', 'boolean', 'number', 'bigint'].includes(typeof res)) {
          Reflect.set(tmp, p, res)
        }
      } catch (e: unknown) {
        console.error('Error:', (e as Error).message)
      }
    }

    return tmp as SystemColors
  }
}

export const colors = new Colors()
