import 'babel-polyfill'
import './augmentation'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
// See https://github.com/mobxjs/mobx-react-lite/#observer-batching
import 'mobx-react/batchingForReactDom'
import PageStateComp from './components/PageState/PageState'
import { isUndefined } from '../lib'
import './lib/clipboard'

const Main = (): JSX.Element => {
  console.log(`Main rendered`)
  return (
    <AppContainer>
      <PageStateComp />
    </AppContainer>
  )
}

function render(): void {
  ReactDOM.render(<Main />, document.getElementById('app'))
}

if (!isUndefined(window)) {
  render()
}

if (module.hot) {
  module.hot.accept(render)
}
