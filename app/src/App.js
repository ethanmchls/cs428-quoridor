// import './App.css';
import React from 'react';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Lobby } from './Lobby';
import { GameScreen } from './GameView';
import { About } from './About';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Lobby />} />
      <Route path="/game" element={<GameScreen />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </Router>
  );
}

export default App;