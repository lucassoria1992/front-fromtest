import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import FormularioCarga from './Components/Formulario';
import ProductItems from '../src/Conteiners/Productos.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/form' element={<FormularioCarga />} />
        <Route path='/list' element={<ProductItems/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
