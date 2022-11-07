import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Cargo from './Components/usuario/Cargo';
import Usuario from './Components/usuario/Usuario';
import Produccion from './Components/fabricacion/Produccion';
import Fabricacion from './Components/fabricacion/Fabricacion';
import Area from './Components/fabricacion/Area';
import Empresa from './Components/empresa/Empresa';
import Especialidad from './Components/empresa/Especialidad';
import Tipo from './Components/insumo/Tipo';
import Salida from './Components/inventario/insumo/Salida';
import Proveedor from './Components/proveedor/Proveedor';
import Insumo from './Components/insumo/Insumo';
import Entradapro from './Components/inventario/producto/Entradapro';
import Categoria from './Components/producto/Categoria';
import Salidapro from './Components/inventario/producto/Salidapro'
import Producto from './Components/producto/Producto'
import Entrada from './Components/inventario/insumo/Entrada'
import Inventario from './Components/inventario/insumo/Inventario'
import Inventariopro from './Components/inventario/producto/Inventariopro';
import Footer from './layouts/footer/Footer';
import Menu from './layouts/menu/Menu';
import Panel from './layouts/panel/Panel';
import Nav from './layouts/nav/Nav';
import Login from './Components/Public/Login';
import Prueba from './Pages/Prueba';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={ <Login /> }/>
        <Route path='/footer' element={<Footer />}/>
        <Route path='/menu' element={<Menu />}/>
        <Route path='/' element={<Prueba />}/>
        <Route path='/nav' element={<Nav />}/>
        <Route path='/panel' element={<Panel />} />
        <Route path='/empresa' element={<Empresa />} />
        <Route path='/especialidad' element={<Especialidad />} />
        <Route path='/tipo' element={<Tipo />} />
        <Route path='/salida' element={<Salida />} />
        <Route path='/proveedor' element={<Proveedor />} />
        <Route path='/insumo' element={<Insumo />} />
        <Route path='cargo' element={<Cargo />} />
        <Route path='usuario' element={<Usuario />} />
        <Route path='produccion' element={<Produccion />} />
        <Route path='fabricacion' element={<Fabricacion />} />
        <Route path='area' element={<Area />} />
        <Route path='/entradapro' element={<Entradapro />} />
        <Route path='/categoria' element={<Categoria />} />
        <Route path='/salidapro' element={<Salidapro />} />
        <Route path='/producto' element={<Producto />} />
        <Route path='entrada' element={<Entrada />} />
        <Route path='/inventario' element={<Inventario />} />
        <Route path='/inventariopro' element={<Inventariopro />} />
      </Routes>
    </BrowserRouter>
);