import { systemPreferences, nativeTheme } from 'electron'
import { hexToRgbCss } from '../lib/colors'

class Colors {
  private nt = nativeTheme

  public get isDarkMode(): boolean {
    return this.nt.shouldUseDarkColors
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

  [Symbol.toPrimitive](hint: string): unknown {
    console.log(`Primitive hint:`, hint)
    switch (hint) {
      case 'number':
        return Object.keys(this.toPlainObject()).length

      case 'string':
        return JSON.stringify(this.toPlainObject())
    }

    return this.toPlainObject()
  }

  public toPlainObject(): this {
    const tmp: Partial<this> = {}
    const proto = Reflect.getPrototypeOf(this)

    for (const p of Object.getOwnPropertyNames(proto)) {
      try {
        const res = Reflect.get(this, p)
        if (['string', 'boolean', 'number', 'bigint'].includes(typeof res)) {
          Reflect.set(tmp, p, res)
        }
      } catch (e) {
        console.error('Error:', e.message)
      }
    }

    return tmp as this
  }
}

export const colors = new Colors()
