import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Empresa from './Components/empresa/Empresa';
import Especialidad from './Components/empresa/Especialidad';
import Tipo from './Components/insumo/Tipo';
import Salida from './Components/inventario/insumo/Salida';
import Proveedor from './Components/proveedor/Proveedor';
import Insumo from './Components/insumo/Insumo';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
  
    const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
              <Routes>
              <Route path='/empresa' element={<Empresa/>}/>
              <Route path='/especialidad' element={<Especialidad/>}/>
              <Route path='/tipo' element={<Tipo/>}/>
              <Route path='/salida' element={<Salida/>}/>
              <Route path='/proveedor' element={<Proveedor/>}/>
              <Route path='/insumo' element={<Insumo/>}/>
              </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
