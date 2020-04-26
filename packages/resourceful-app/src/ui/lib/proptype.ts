import PropTypes from 'prop-types'
import { PlainObject } from '../../lib'

export interface AddPropTypes<T> {
  propTypes: T
}

export type WithPropTypes<F extends Function> = F & AddPropTypes<PlainObject>

export type WithChildren<F extends Function> = F &
  AddPropTypes<{
    children: PropTypes.Requireable<PropTypes.ReactNodeLike>
  }>

export function withChildren<F extends Function>(f: F): WithChildren<F> {
  const t = f as WithPropTypes<F>

  if (!t.propTypes) {
    t.propTypes = {}
  }

  t.propTypes.children = PropTypes.node

  return t as WithChildren<F>
}
