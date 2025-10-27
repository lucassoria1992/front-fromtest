import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ProductItems from '../src/Conteiners/Productos.jsx';
import Layout from './Components/Header';
import LoadingBoundary from './Components/LoadingBoundary';
// import Home from './Pages/Home'
import { CartProvider } from './context/CartContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout/>
        <LoadingBoundary>
          <Routes>
            <Route path='/' element={<ProductItems />} />
            <Route path='/list' element={<ProductItems />} />
            <Route path='*' element={<ProductItems />} />
          </Routes>
        </LoadingBoundary>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
