import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Cargo from './Components/usuario/Cargo';
import Usuario from './Components/usuario/Usuario';
import Produccion from './Components/fabricacion/Produccion';
import Fabricacion from './Components/fabricacion/Fabricacion';
import Area from './Components/fabricacion/Area';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='cargo' element={<Cargo />} />
        <Route path='usuario' element={<Usuario />} />
        <Route path='produccion' element={<Produccion />} />
        <Route path='fabricacion' element={<Fabricacion />} />
        <Route path='area' element={<Area />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
