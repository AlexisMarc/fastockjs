import React, { Component } from 'react'
import '../../static/css/styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCoffee } from '@fortawesome/free-solid-svg-icons';



function Menu() {
    return (
        <div>
            <nav className="sidebar sidebar-offcanvas" id="sidebar">
                <ul className="nav">
                    <li className="nav-item">
                        <a className="nav-link">
                            <i className="icon-grid menu-icon"></i>
                            <span className="menu-title">Inicio</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="collapse" href="#fabricacion" aria-expanded="false"
                            aria-controls="ui-basic">
                            <i ><FontAwesomeIcon icon={faCoffee} /></i>
                            <span className="menu-title">Producción</span>
                            <i ><FontAwesomeIcon icon={faCoffee} /></i>
                        </a>
                        <div className="collapse" id="fabricacion">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item"> <a className="nav-link"
                                >Producto</a></li>
                                <li className="nav-item"> <a className="nav-link"
                                >Insumo</a></li>
                                <li className="nav-item"> <a className="nav-link"
                                >Fabricación</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">
                            <i className="icon-grid menu-icon"></i>
                            <span className="menu-title">Empleado</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="collapse" href="#entidad" aria-expanded="false"
                            aria-controls="ui-basic">
                            <i className="icon-layout menu-icon"></i>
                            <span className="menu-title">Entidad</span>
                            <i className="menu-arrow"></i>
                        </a>
                        <div className="collapse" id="entidad">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item"> <a className="nav-link"
                                >Empresa</a></li>
                                <li className="nav-item"> <a className="nav-link"
                                >Proveedor</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="collapse" href="#inventario" aria-expanded="false"
                            aria-controls="ui-basic">
                            <i className="icon-layout menu-icon"></i>
                            <span className="menu-title">Inventario</span>
                            <i className="menu-arrow"></i>
                        </a>
                        <div className="collapse" id="inventario">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item"> <a className="nav-link"
                                >Productos</a></li>
                                <li className="nav-item"> <a className="nav-link"
                                >Insumos</a></li>
                            </ul>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">
                            <i className="icon-grid menu-icon"></i>
                            <span className="menu-title">Novedades</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" >
                            <i className="icon-grid menu-icon"></i>
                            <span className="menu-title">Otros</span>
                        </a>
                    </li>

                </ul>
            </nav>
        </div>
    )
}
export default Menu;