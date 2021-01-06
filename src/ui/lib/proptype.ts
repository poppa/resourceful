import PropTypes from 'prop-types'
import type { AnyFunction, PlainObject } from '../../lib'

export type AddPropTypes<F, T> = F & {
  propTypes: T
}

export type WithPropTypes<F extends AnyFunction> = AddPropTypes<F, PlainObject>

export type WithChildren<F extends AnyFunction> = AddPropTypes<
  F,
  { children: PropTypes.Requireable<PropTypes.ReactNodeLike> }
>

export function withChildren<F extends AnyFunction>(f: F): WithChildren<F> {
  const t = f as WithPropTypes<F>

  if (!t.propTypes) {
    t.propTypes = {}
  }

  t.propTypes.children = PropTypes.node

  return t as WithChildren<F>
}
