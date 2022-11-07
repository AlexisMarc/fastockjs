import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons';



function Menu() {
    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
                <li className="nav-item">
                    <a className="nav-link" href="/">
                        <i className="ti-home menu-icon"></i>
                        <span className="menu-title">Inicio</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="collapse" href="#fabricacion" aria-expanded="false"
                        aria-controls="ui-basic">
                        <i className="ti-settings menu-icon"></i>
                        <span className="menu-title">Producción</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="fabricacion">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <a className="nav-link" href="/producto">Producto</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/insumo">Insumo</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/fabricacion">Fabricación</a></li>
                        </ul>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/empleado">
                        <i className="ti-user menu-icon"></i>
                        <span className="menu-title">Empleado</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="collapse" href="#entidad" aria-expanded="false"
                        aria-controls="ui-basic">
                        <i className="ti-shopping-cart-full menu-icon"></i>
                        <span className="menu-title">Entidad</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="entidad">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <a className="nav-link" href="/empresa">Empresa</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/proveedor">Proveedor</a></li>
                        </ul>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-toggle="collapse" href="#inventario" aria-expanded="false"
                        aria-controls="ui-basic">
                        <i className="ti-package menu-icon"></i>
                        <span className="menu-title">Inventario</span>
                        <i className="menu-arrow"></i>
                    </a>
                    <div className="collapse" id="inventario">
                        <ul className="nav flex-column sub-menu">
                            <li className="nav-item"> <a className="nav-link" href="/inventariopro">Productos</a></li>
                            <li className="nav-item"> <a className="nav-link" href="/inventario">Insumos</a></li>
                        </ul>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/">
                        <i className="ti-bookmark-alt menu-icon"></i>
                        <span className="menu-title">Novedades</span>
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/">
                        <i className="icon-grid menu-icon"></i>
                        <span className="menu-title">Otros</span>
                    </a>
                </li>

            </ul>
        </nav>
    )
}
export default Menu;