import React, { Component } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/proveedor";



class proveedor extends Component {

    state = {
        data: [],
        modalInsertar: false,
        form: {
            id: '',
            contacto: '',
            direccion: '', 
            email: '',
            nombre: '',
            telefono: '',
            tipoModal: ''
        }
    }


    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data.content});
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
    seleccionarProveedor = (proveedor) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: proveedor.id,
                contacto: proveedor.contacto,
                direccion: proveedor.direccion,
                email: proveedor.email,
                estado: proveedor.estado,
                nombre: proveedor.nombre,
                telefono: proveedor.telefono,
                identificacion: proveedor.identificacion
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
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Proveedor</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>contacto</th>
                            <th>direccion</th>
                            <th>email</th>
                            <th>estado</th>
                            <th>nombre</th>
                            <th>telefono</th>
                            <th>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(proveedor => {
                            return (
                                <tr>
                                    <td>{proveedor.id}</td>
                                    <td>{proveedor.contacto}</td>
                                    <td>{proveedor.direccion}</td>
                                    <td>{proveedor.email}</td>
                                    <td>{proveedor.estado}</td>
                                    <td>{proveedor.nombre}</td>
                                    <td>{proveedor.telefono}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={() => { this.seleccionarProveedor(proveedor); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                            <label htmlFor="contacto">contacto</label>
                            <input className="form-control" type="text" name='contacto' id='contacto' onChange={this.handleChange} value={form ? form.contacto: ''} />
                            <br />
                            <label htmlFor='direccion'>direccion</label>
                            <input className='form-control' type='text' name='direccion' id='direccion' onChange={this.handleChange} value={form ? form.direccion: ''} />
                            <br />
                            <label htmlFor='email'>email</label>
                            <input className='form-control' type='text' name='email' id='email' onChange={this.handleChange} value={form ? form.email: ''} />
                            <br />
                            <label htmlFor='estado'>estado</label>
                            <input className='form-control' type='text' name='estado' id='estado' onChange={this.handleChange} value={form ? form.estado:''} />
                            <br />
                            <label htmlFor='nombre'>nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChange} value={form ? form.nombre: ''} />
                            <br />
                            <label htmlFor='telefono'>telefono</label>
                            <input className='form-control' type='text' name='telefono' id='telefono' onChange={this.handleChange} value={form ? form.telefono: ''} />
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
            </div>
        );
    }
}

export default proveedor;