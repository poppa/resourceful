import PropTypes from 'prop-types'
import { PlainObject } from '../../lib'

export type AddPropTypes<F, T> = F & {
  propTypes: T
}

export type WithPropTypes<F extends Function> = AddPropTypes<F, PlainObject>

export type WithChildren<F extends Function> = AddPropTypes<
  F,
  { children: PropTypes.Requireable<PropTypes.ReactNodeLike> }
>

export function withChildren<F extends Function>(f: F): WithChildren<F> {
  const t = f as WithPropTypes<F>

  if (!t.propTypes) {
    t.propTypes = {}
  }

  t.propTypes.children = PropTypes.node

  return t as WithChildren<F>
}
