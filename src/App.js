
import React from 'react';
import './index.css'; 
import CityCards from './CityCards'; // Component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>10 Cities of the United States</h1>
      </header>
      <main>
        <CityCards />
      </main>
    </div>
  );
}

export default App;
