import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [stateCar, setState] = useState(false)

  const [contar, setContar] = useState(0)

  const encenderApagar = () => {
    // setState(!stateCar)
    setState(preValue => !preValue)
    setContar(contar+1)
  }

  useEffect(() => {

    console.log('Total:', contar)

  }, [contar])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <h3>El Carro esta { stateCar? 'Encencido': 'Apagado' }</h3>

        <h3>Clicks: { contar }</h3>

        <button onClick={encenderApagar}>Encender / Apagar</button>

      </header>
    </div>
  );
}

export default App;
