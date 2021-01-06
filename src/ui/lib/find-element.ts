import type { Maybe } from '../../lib'

export function findElementByClassName(
  el: Element,
  className: string
): Maybe<Element> {
  if (el.classList.contains(className)) {
    return el
  }

  return el.closest(`.${className}`) ?? undefined
}
