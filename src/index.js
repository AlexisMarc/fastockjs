import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import Categoria from './Components/producto/Categoria';
// import Entradapro from './Components/inventario/producto/Entradapro';
// import Salidapro from './Components/inventario/producto/Salidapro'
// import Producto from './Components/producto/Producto'
// import Entrada from './Components/inventario/insumo/Entrada'
// import Inventario from './Components/inventario/insumo/Inventario'
import Inventariopro from './Components/inventario/producto/Inventariopro';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
    {/* <Entradapro /> */}
    {/* <Categoria /> */}
    {/* <Salidapro/> */}
    {/* <Producto/> */}
    {/* <Entrada/> */}
    {/* <Inventario/> */}
    <Inventariopro/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
