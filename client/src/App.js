import React from 'react';
import './App.css';

import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Landing />
      <Footer />
    </div>
  );
}

export default App;
