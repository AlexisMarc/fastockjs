import React, { Component } from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/especialidad";



class Especialidad extends Component {

    state = {
        data: [],
        modalInsertarEspecialidad: false,
        form: {
            nombre: '',
            descripcion: ''
        }
    }


    peticionGetEspecialidad = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data.content });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPostEspecialidad = async () => {

        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertarEspecialidad();
            this.peticionGetEspecialidad();

        }).catch(error => {
            console.log(error.message);
        })

    }
        peticionPutEspecialidad = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertarEspecialidad();
            this.peticionGetEspecialidad();
        })
    }
    modalInsertarEspecialidad = () => {
        this.setState({ modalInsertarEspecialidad: !this.state.modalInsertarEspecialidad });
    }
    seleccionarEspecialidad = (especialidad) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                nombre: especialidad.nombre,
                descripcion: especialidad.descripcion,
                identificacion: especialidad.identificacion
            }
        })
    }
    handleChangeEspecialidad = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMountEspecialidad() {
        this.peticionGetEspecialidad();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarEspecialidad() }}>Agregar Especialidad</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(especialidad => {
                            return (
                                <tr>
                                    <td>{especialidad.nombre}</td>
                                    <td>{especialidad.descripcion}</td>
                                    <td>
                                    <button className='btn btn-primary' onClick={() => { this.seleccionarEspecialidad(especialidad); this.modalInsertarEspecialidad() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {" "}
                                        <button className='btn btn-danger'><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>


                <Modal isOpen={this.state.modalInsertarEspecialidad}>
                    <ModalHeader style={{ display: "block" }}>
                        <span style={{ float: 'righ' }} >Agregar Especialidad</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChangeEspecialidad} value={form ? form.nombre: ''} />
                            <div />
                            <label htmlFor='descripcion'>Descripción</label>
                            <input className='form-control' type='text' name='descripcion' id='descripcion' onChange={this.handleChangeEspecialidad} value={form ? form.descripcion:''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-primary' onClick={() => this.peticionPostEspecialidad()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPutEspecialidad()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertarEspecialidad()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Especialidad;