import React from 'react';
import logo from './logo.svg';
import './App.css';
import Saludar from './components/Saludar';

// import HolaMundo from './componentsOld/HolaMundo'
// import AdiosMundo from './componentsOld/AdiosMundo'

function App() {

  const userName = 'Luis Briceño'
  const age = 29


  const user = {
    name:userName,
    age,
    color: 'verde'
  }

  const saludarFn = (name, age, color) => {
    console.log(`Hola ${name}, con ${age} años y le gusta el color ${color}`)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {/* userInfo={user} */}
        <Saludar userInfo={user} saludarFn={saludarFn}/>

      </header>
    </div>
  );
}

export default App;
