import { useEffect, useState } from 'react'

import { NxWelcome } from './nx-welcome'


const names = [
  'Kamil',
  'Adam',
  'Krzysiek',
  'Ania',
  'Basia',
]

export function App() {
  const [ count, setCount ] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => setCount(c => c + 1), 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  const name = names[count % names.length]
  
  return (
    <div>
      <p>{ name }</p>
      <NxWelcome title={ name } />
    </div>
  )
}

export default App
