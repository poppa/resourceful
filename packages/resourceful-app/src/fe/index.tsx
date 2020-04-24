import React from 'react'
import ReactDOM from 'react-dom'

console.log(`index.tsx is here`)

const Main = (): JSX.Element => {
  return <div>This is the App</div>
}

ReactDOM.render(<Main />, document.getElementById('app'))
