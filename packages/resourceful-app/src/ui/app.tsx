import React from 'react'
import ReactDOM from 'react-dom'
import Homescreen from './components/Homescreen'

const Main = (): JSX.Element => {
  return <Homescreen />
}

ReactDOM.render(<Main />, document.getElementById('app'))
