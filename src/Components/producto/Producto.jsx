import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Cookies from 'universal-cookie';
import { autorizacion } from '../../Utils/Api';

const cookies = new Cookies();
const url = "http://localhost:8083/api/producto";

class Producto extends Component {

    state = {
        data: [],
        modalInsertar: false,
        producto: {
                nombre: '',
                material: '',
                imagen: '',
                categoria: 0
        },
        modalInsertarCategoria: false,
            categoria: {
                id: '',
                nombre: '',
                nombre: '',
                tipoModal: ''
            }
    }


    peticionGet = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {

        await axios.post(url,this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();

        }).catch(error => {
            console.log(error.message);
        })

    }

    peticionPut = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarEmpresa = (producto) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                nombre: producto.nombre,
                material: producto.material,
                imagen: producto.imagen,
                categoria: producto.categoria
            }
        })
    }

    handleChange = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMount() {
        this.peticionGet();
    }

    //-------------------------------- CAtegoria -----------------------------------------//
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
                id: categoria.id,
                nombre: categoria.nombre,
                nombre: categoria.nombre
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
    //render
    render() {
        const { form, categoria } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Producto</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Material</th>
                            <th>Imagen</th>
                            <th>Categoria</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(producto => {
                            return (
                                <tr>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.materal}</td>
                                    <td>{producto.imagen}</td>
                                    <td>{producto.categoria}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={() => { this.seleccionarEmpresa(producto); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {" "}
                                        <button className='btn btn-danger'><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>


                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: "block" }}>
                        <span style={{ float: 'righ' }} >x</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChange} value={form ? form.nombre : ''} />
                            <div />
                            <label htmlFor='material'>Material</label>
                            <input className='form-control' name='material' id='material' onChange={this.handleChange} value={form ? form.material : ''} />
                            <div />
                            <label htmlFor='imagen'>Imagen</label>
                            <input className='form-control' name='imagen' id='imagen' onChange={this.handleChange} value={form ? form.imagen : ''} />
                            <div />
                            <label htmlFor='categoria'>Categoria</label>
                            <input className='form-control' type="text" name='categoria' id='categoria' onChange={this.handleChange} value={form ? form.categoria : ''} />
                            <div>
                            <button className='btn btn-primary' onClick={() => { this.setState({ categoria: null }); this.modalInsertarCategoria() }}>Agregar Categoria</button>
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-primary' onClick={() => this.peticionPost()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPut()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertar()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.modalInsertarCategoria}>
                    <ModalHeader style={{ display: "block" }}>
                        <span style={{ float: 'righ' }} >x</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="number" name="id" id="id" readOnly onChange={this.handleChangeCategoria} value={categoria ? categoria.id : this.state.data.length + 1} />
                            <br />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChangeCategoria} value={categoria ? categoria.nombre : ''} />
                            <div />
                            <label htmlFor='nombre'>Descripción</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChangeCategoria} value={categoria ? categoria.nombre : ''} />
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

export default Producto;