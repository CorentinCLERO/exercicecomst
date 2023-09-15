import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Accueil from './components/Accueil';
import Connection from './components/Connection';
import Inscription from './components/Inscription';

function App() {
  const [compte, setCompte] = useState(null);

  useEffect(() => {
    const storedCompte = localStorage.getItem('compte');
    if (storedCompte) {
      setCompte(JSON.parse(storedCompte));
    }
  }, []);

  useEffect(() => {
    if (compte !== null) localStorage.setItem('compte', JSON.stringify(compte));
  }, [compte]);


  return (
    <BrowserRouter>
      <Header compte={compte} />
      <Routes>
        <Route path='/' element={<Accueil setCompte={setCompte} compte={compte} />}></Route>
        <Route path='/Connection' element={<Connection setCompte={setCompte} compte={compte} />}></Route>
        <Route path='/Inscription' element={<Inscription setCompte={setCompte} compte={compte} />}></Route>
      </Routes>
      {compte !== null && <Navigate to='/' />}
    </BrowserRouter>
  );
}

export default App;

