import React from 'react';
import { Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import FormularioCarga from './Components/Formulario';
import ItemsList from './Conteiners/ItemsList.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/form' element={<FormularioCarga />} />
        <Route path='/list' element={<ItemsList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
