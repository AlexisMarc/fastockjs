import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Entradapro from './Components/inventario/producto/Entradapro';
import Categoria from './Components/producto/Categoria';
import Salidapro from './Components/inventario/producto/Salidapro'
import Producto from './Components/producto/Producto'
import Entrada from './Components/inventario/insumo/Entrada'
import Inventario from './Components/inventario/insumo/Inventario'
import Inventariopro from './Components/inventario/producto/Inventariopro';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/*http://localhost:3000/entradapro */}
        <Route path='/entradapro' element={<Entradapro />} />

        {/* http://localhost:3000/categoria */}
        <Route path='/categoria' element={<Categoria />} />

        {/* http://localhost:3000/salidapro */}
        <Route path='/salidapro' element={<Salidapro />} />

        {/* http://localhost:3000/producto */}
        <Route path='/producto' element={<Producto />} />

        {/* http://localhost:3000/entrada */}
        <Route path='entrada' element={<Entrada />} />

        {/* http://localhost:3000/inventario */}
        <Route path='/inventario' element={<Inventario />} />

        {/* http://localhost:3000/inventariopro */}
        <Route path='/inventariopro' element={<Inventariopro />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
