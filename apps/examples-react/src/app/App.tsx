import { useState } from 'react';

export function App() {
  const [ value, setValue ] = useState('');
  
  const values = value.split('');
  
  return (
    <>
      <input value={values} onChange={e => setValue(e.target.value)} />
      
      <ul>
        { values.map((el, i) => (
          <li key={ i }>{ el }</li>
        )) }
      </ul>
    </>
  );
}
