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
import Error from './layouts/error/Error';
import Footer from './layouts/footer/Footer';
import Menu from './layouts/menu/Menu';
import Panel from './layouts/panel/Panel';
import Nav from './layouts/nav/Nav';
import Login from './Components/Public/Login';
import Prueba from './Pages/Prueba';
import PageProveedor from './Pages/PageProveedor';
import PageUsuario from './Pages/PageUsuario';
import PageInventarioPro from './Pages/PageInventarioPro';
import PageInventario from './Pages/PageInventario';
import PageInsumo from './Pages/PagesInsumo';
import PageEmpresa from './Pages/PageEmpresa';
import PageProducto from './Pages/PageProducto';
import PageFabricacion from './Pages/PagesFabricacion';
import DataTableResponsiveDemo from './Components/prueba/DataTableResponsiveDemo';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route exact path='/login' element={ <Login /> }/>
        <Route path='/dashboard' element={<Prueba />}/>
        <Route path='/empresa' element={<PageEmpresa />} />
        <Route path='/proveedor' element={<PageProveedor />} />
        <Route path='/insumo' element={<PageInsumo />} />
        <Route path='/usuario' element={<PageUsuario />} />
        <Route path='fabricacion' element={<PageFabricacion />} />
        <Route path='/producto' element={<PageProducto />} />
        <Route path='/inventario' element={<PageInventario />} />
        <Route path='/inventariopro' element={<PageInventarioPro />} />
        <Route path='/prueba' element={<DataTableResponsiveDemo />} />
        <Route path='*' element={<Error/>} />

      </Routes>
    </BrowserRouter>

);