import React, { Component } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/categoria";

class Categoria extends Component {

    state = {
        data: [],
        modalInsertarCategoria: false,
        categoria: {
            nombre: '',
            descripcion: '',
            filtro: ''
        }
    }


    peticionGetCategoria = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPostCategoria = async () => {

        delete this.state.categoria.id;
        await axios.post(url, this.state.categoria).then(response => {
            this.modalInsertarCategoria();
            this.peticionGetCategoria();

        }).catch(error => {
            console.log(error.message);
        })

    }

    peticionPutCategoria = () => {
        axios.put(url + this.state.categoria.id, this.state.categoria).then(response => {
            this.modalInsertarCategoria();
            this.peticionGetCategoria();
        })
    }

    modalInsertarCategoria = () => {
        this.setState({ modalInsertarCategoria: !this.state.modalInsertarCategoria });
    }

    seleccionarCategoria = (categoria) => {
        this.setState({
            tipoModal: 'actualiza',
            categoria: {
                nombre: categoria.nombre,
                descripcion: categoria.descripcion,
                filtro: categoria.filtro
                
            }
        })
    }

    handleChangeCategoria = async e => {
        e.persist();
        await this.setState({
            categoria: {
                ...this.state.categoria,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.categoria);
    }

    componentDidMountCategoria() {
        this.peticionGetCategoria();
    }

    render() {
        const { categoria } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-primary' onClick={() => { this.setState({ categoria: null, tipoModal: 'insertar' }); this.modalInsertarCategoria() }}>Agregar Categoria</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Filtro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(categoria => {
                            return (
                                <tr>
                                    <td>{categoria.nombre}</td>
                                    <td>{categoria.descripcion}</td>
                                    <td>{categoria.filtro}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={() => { this.seleccionarCategoria(categoria); this.modalInsertarCategoria() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {" "}
                                        <button className='btn btn-danger'><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>


                <Modal isOpen={this.state.modalInsertarCategoria}>
                    <ModalHeader style={{ display: "block" }}>
                        <span style={{ float: 'righ' }} >nueva categoría</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChangeCategoria} value={categoria ? categoria.nombre : ''} />
                            <div />
                            <label htmlFor='descripcion'>Descripción</label>
                            <input className='form-control' type='text' name='descripcion' id='descripcion' onChange={this.handleChangeCategoria} value={categoria ? categoria.descripcion : ''} />
                            <label htmlFor='filtro'>Filtro</label>
                            <input className='form-control' type='text' name='filtro' id='filtro' onChange={this.handleChangeCategoria} value={categoria ? categoria.descripcion : ''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-primary' onClick={() => this.peticionPostCategoria()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPutCategoria()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertarCategoria()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Categoria;