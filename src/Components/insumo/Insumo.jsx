import React, { Component } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/insumo";



class Insumo extends Component {

    state = {
        data: [],
        modalInsertar: false,
        insumo: {
            nombre: '',
            material: '',
            imagen: '',
            proveedor: 0,
            tipo: 0
        }
    }


    peticionGetInsumo = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data.content});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPostInsumo = async () => {

        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();

        }).catch(error => {
            console.log(error.message);
        })

    }
    peticionPutInsumo = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    modalInsertarInsumo = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }
    seleccionarInsumo = (insumo) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                
                nombre: insumo.nombre,
                material: insumo.material,
                imagen: insumo.imagen,
                proveedor: insumo.proveedor,
                tipo: insumo.tipo
            }
        });
    }

    handleChangeInsumo = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMountInsumo() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarInsumo() }}>Agregar Insumo</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>nombre</th>
                            <th>material</th>
                            <th>imagen</th>
                            <th>proveedor</th>
                            <th>tipo</th>
                            <th>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(insumo => {
                            return (
                                <tr>
                                    <td>{insumo.nombre}</td>
                                    <td>{insumo.material}</td>
                                    <td>{insumo.imagen}</td>
                                    <td>{insumo.proveedor}</td>
                                    <td>{insumo.tipo}</td>
                                    <td>
                                    <button className='btn btn-primary' onClick={() => { this.seleccionarInsumo(insumo); this.modalInsertarInsumo() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                            <label htmlFor='nombre'>nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChange} value={form ? form.nombre:''} />
                            <br />
                            <label htmlFor='material'>material</label>
                            <input className='form-control' type='text' name='material' id='material' onChange={this.handleChange} value={form ? form.material:''} />
                            <br />
                            <label htmlFor='imagen'>imagen</label>
                            <input className='form-control' type='text' name='imagen' id='imagen' onChange={this.handleChange} value={form ? form.imagen: ''} />
                            <br />
                            <label htmlFor='proveedor'>proveedor</label>
                            <input className='form-control' type='text' name='proveedor' id='proveedor' onChange={this.handleChange} value={form ? form.proveedor: ''} />
                            <br />
                            <label htmlFor='tipo'>tipo</label>
                            <input className='form-control' type='text' name='tipo' id='tipo' onChange={this.handleChange} value={form ? form.tipo: ''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-primary' onClick={() => this.peticionPostInsumo()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPutInsumo()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertarInsumo()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Insumo;