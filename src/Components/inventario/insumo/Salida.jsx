import React, { Component } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/salida";



class salida extends Component {

    state = {
        data: [],
        modalInsertar: false,
        form: {
            id: '',
            cantidad: '',
            estado: '', 
            fecha: '',
            empleado_id: '',
            inventario_id: '',
            usuario_id: ''
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

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
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
    seleccionarSalida = (salida) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: salida.id,
                cantidad: salida.cantidad,
                estado: salida.estado,
                fecha: salida.fecha,
                empleado_id: salida.empleado_id,
                inventario_id: salida.inventario_id,
                usuario_id: salida.usuario_id,
                identificacion: salida.identificacion
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
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Salida</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Cantidad</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Empleado_id</th>
                            <th>Inventario_id</th>
                            <th>Usuario_id</th>
                            <th>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(salida => {
                            return (
                                <tr>
                                    <td>{salida.id}</td>
                                    <td>{salida.cantidad}</td>
                                    <td>{salida.estado}</td>
                                    <td>{salida.fecha}</td>
                                    <td>{salida.empleado_id}</td>
                                    <td>{salida.inventario_id}</td>
                                    <td>{salida.usuario_id}</td>
                                    <td>
                                    <button className='btn btn-primary' onClick={() => { this.seleccionarSalida(salida); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                            <label htmlFor="cantidad">cantidad</label>
                            <input className="form-control" type="text" name='cantidad' id='cantidad' onChange={this.handleChange} value={form ? form.cantidad :''} />
                            <br />
                            <label htmlFor='estado'>Estado</label>
                            <input className='form-control' type='text' name='estado' id='estado' onChange={this.handleChange} value={form ? form.estado:''} />
                            <br />
                            <label htmlFor='fecha'>Fecha</label>
                            <input className='form-control' type='text' name='fecha' id='fecha' onChange={this.handleChange} value={form ? form.fecha:''} />
                            <br />
                            <label htmlFor='empleado_id'>Empleado_id</label>
                            <input className='form-control' type='text' name='empleado_id' id='empleado_id' onChange={this.handleChange} value={form ? form.empleado_id:''} />
                            <br />
                            <label htmlFor='inventario_id'>Inventario_id</label>
                            <input className='form-control' type='text' name='inventario_id' id='inventario_id' onChange={this.handleChange} value={form ? form.inventario_id:''} />
                            <br />
                            <label htmlFor='usuario_id'>Usuario_id</label>
                            <input className='form-control' type='text' name='usuario_id' id='usuario_id' onChange={this.handleChange} value={form ? form.usuario_id:''} />
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

export default salida;