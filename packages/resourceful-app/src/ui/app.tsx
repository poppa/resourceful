import './augmentation'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
// See https://github.com/mobxjs/mobx-react-lite/#observer-batching
import 'mobx-react/batchingForReactDom'
import PageStateComp from './components/PageState/PageState'
import { isUndefined } from '../lib'

const Main = (): JSX.Element => {
  return (
    <AppContainer>
      <PageStateComp />
    </AppContainer>
  )
}

function render(): void {
  console.log(`Render`)
  ReactDOM.render(<Main />, document.getElementById('app'))
}

if (!isUndefined(window)) {
  render()
}

if (module.hot) {
  module.hot.accept(render)
}
