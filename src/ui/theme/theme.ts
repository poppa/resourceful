/* eslint-disable @typescript-eslint/no-use-before-define */
import { CssValue, cssRGBValue, cssColor } from './utils'
import type { RGB } from '../../lib/colors'
import { lighten, darken } from '../../lib/colors'
import { staticStore, confirmState } from '../storage'
import type { SystemColors } from '../../app/colors'

export interface ThemeProperies {
  primary: CssValue
  primaryBg: CssValue
  primaryBg2: CssValue
  primaryBg3: CssValue
  primaryText: CssValue
  secondary: CssValue
  tabsBg: CssValue
}

let theme: Theme

export function applyTheme(): void {
  const colors = staticStore.appRuntimeInfo?.colors

  if (!colors) {
    console.error(`applyTheme called before runtime was loaded`)
    return
  }

  const prevIsDark = theme && theme instanceof DarkTheme
  const prevIsLight = theme && theme instanceof LightTheme

  if (colors.isDarkMode) {
    theme = new DarkTheme(colors)
  } else {
    theme = new LightTheme(colors)
  }

  if (
    (prevIsDark && theme instanceof LightTheme) ||
    (prevIsLight && theme instanceof DarkTheme)
  ) {
    confirmState.setState({
      description:
        'You need to restart the application for this change to ' +
        'take full effect',
      title: 'System color theme changed',
      onConfirm() {
        confirmState.setState()
      },
    })
  }

  theme.apply()
}

export class Theme implements ThemeProperies {
  protected root: CSSStyleDeclaration

  public primary: CssValue
  public primaryOff: CssValue
  public primaryBg: CssValue
  public primaryBg2: CssValue
  public primaryBg3: CssValue
  public primaryText: CssValue
  public primaryTextContrast: CssValue
  public secondary: CssValue
  public tabsBg: CssValue

  constructor(colors: SystemColors) {
    this.root = (document.querySelector('html') as HTMLHtmlElement).style

    this.primary = cssColor(colors.accent)
    this.primaryOff = cssRGBValue(lighten(colors.background, 25))
    this.primaryBg = cssColor(colors.background)
    this.primaryBg2 = cssRGBValue(lighten(this.primaryBg.value as RGB, 7))
    this.primaryBg3 = cssRGBValue(lighten(this.primaryBg.value as RGB, 12))
    this.primaryTextContrast = cssColor(colors.foreground)
    this.primaryText = cssRGBValue(darken(colors.foreground, 30))
    this.secondary = cssRGBValue(lighten(this.primary.value as RGB, 20))
    this.tabsBg = cssRGBValue(darken(this.primaryBg.value as RGB, 15))
  }

  public getProp(which: string): string {
    return this.root.getPropertyValue('--' + which)
  }

  public setProp(which: string, what: CssValue | string): this {
    const val = what.toString()
    this.root.setProperty('--' + which, val)
    return this
  }

  public unsetProp(which: string): this {
    this.root.setProperty('--' + which, null)
    return this
  }

  public applyProp<K extends keyof ThemeProperies>(prop: K): this {
    const val = this[prop]

    if (val && val instanceof CssValue) {
      if (!val.isUndefined()) {
        const cssprop = this.jsPropToCss(prop)
        this.setProp(cssprop, this[prop].toString())
      }
    }

    return this
  }

  public apply(): this {
    Object.getOwnPropertyNames(this).forEach((prop) => {
      const res = Reflect.get(this, prop)

      if (res && res instanceof CssValue) {
        this.applyProp(prop as keyof ThemeProperies)
      }
    })

    return this
  }

  protected jsPropToCss<P extends keyof ThemeProperies>(p: P): string {
    let val = ''
    const len = p.length

    for (let i = 0; i < len; i++) {
      const cc = p.charCodeAt(i)

      if (cc < 97 && (cc < 48 || cc > 57)) {
        val += '-' + p.charAt(i).toLowerCase()
      } else {
        val += p.charAt(i)
      }
    }

    return val
  }
}

class DarkTheme extends Theme {
  constructor(colors: SystemColors) {
    super(colors)
  }
}

class LightTheme extends Theme {
  constructor(colors: SystemColors) {
    super(colors)
    this.primaryBg = cssRGBValue(
      lighten(cssColor(colors.background).value as RGB, 60)
    )
    this.primaryTextContrast = cssColor(colors.foreground)
    this.primaryText = cssRGBValue(lighten(colors.foreground, 20))
    this.primaryOff = cssRGBValue(darken(colors.background, 20))
    this.primaryBg2 = cssRGBValue(darken(this.primaryBg.value as RGB, 12))
    this.primaryBg3 = cssRGBValue(darken(this.primaryBg.value as RGB, 19))
    this.tabsBg = cssRGBValue(darken(this.primaryBg.value as RGB, 25))
  }
}
