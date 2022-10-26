import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/producto";

class Producto extends Component {

    state = {
        data: [],
        modalInsertar: false,
        form: {
            id: '',
            descripcion: '',
            estado: '',
            imagene: '',
            nombre: ''
        }
    }


    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPost = async () => {

        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
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
                id: producto.id,
                descripcion: producto.descripcion,
                estado: producto.estado,
                imagen: producto.imagen,
                nombre: producto.nombre
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

    render() {
        const { form } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Producto</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(producto => {
                            return (
                                <tr>
                                    <td>{producto.id}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.estado}</td>
                                    <td>{producto.imagen}</td>
                                    <td>{producto.nombre}</td>
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
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="number" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <br />
                            <label htmlFor="descripcion">Descripción</label>
                            <input className="form-control" type="text" name='descripcion' id='descripcion' onChange={this.handleChange} value={form ? form.descripcion : ''} />
                            
                            <div />
                            <label htmlFor='estado'>Estado</label>
                            <input className='form-control'  name='estado' id='estado' onChange={this.handleChange} value={form ? form.estado : ''} />
                            <div />
                            <label htmlFor='imagen'>Imagen</label>
                            <input className='form-control'  name='imagen' id='imagen' onChange={this.handleChange} value={form ? form.imagene : ''} />
                            <div />
                            <label htmlFor='nombre'>Nombre</label>
                            <input className='form-control' type="text" name='nombre' id='nombre' onChange={this.handleChange} value={form ? form.nombre : ''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal == 'insertar' ?
                            <button className='btn btn-success' onClick={() => this.peticionPost()}>
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
            </div>
        );
    }
}

export default Producto;