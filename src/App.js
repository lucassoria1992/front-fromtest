import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProductItems from '../src/Conteiners/Productos.jsx';
import Layout from './Components/Header';
import Home from './Pages/Home'
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout/>
        <Routes>
          <Route path='/' element={<ProductItems />} />
          <Route path='/list' element={<ProductItems />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
