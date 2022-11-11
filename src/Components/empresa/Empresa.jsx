import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/empresa";



class Empresa extends Component {

    state = {
        data: [],
        modalInsertar: false,
        empresa: {
            nombre: '',
            contacto: '',
            telefono: 0,
            direccion: '',
            email: '',
            imagen: '',
            especialidad: 0
        }
    }


    peticionGetEmpresa = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data.content });
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPostEmpresa = async () => {

        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();

        }).catch(error => {
            console.log(error.message);
        })

    }
    peticionPutEmpresa = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }
    modalInsertarEmpresa = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }
    seleccionarEmpresa = (empresa) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                nombre: empresa.nombre,
                contacto: empresa.contacto,
                telefono: empresa.telefono,
                direccion: empresa.direccion,
                email: empresa.email,
                imagen: empresa.imagen,
                especialidad: empresa.especialidad
            }
        })
    }
    modalInsertarEmpresa = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    handleChangeEmpresa = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMountEmpresa() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarEmpresa() }}>Agregar Empresa</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>nombre</th>
                            <th>contacto</th>
                            <th>telefono</th>
                            <th>direccion</th>
                            <th>email</th>
                            <th>imagen</th>
                            <th>especialidad</th>
                            <th>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(empresa => {
                            return (
                                <tr>
                                <td>{empresa.nombre}</td>
                                    <td>{empresa.contacto}</td>
                                    <td>{empresa.telefono}</td>
                                    <td>{empresa.direccion}</td>
                                    <td>{empresa.email}</td>
                                    <td>{empresa.imagen}</td>
                                    <td>{empresa.especialidad}</td>
                                    <td>
                                    <button className='btn btn-primary' onClick={() => { this.seleccionarEmpresa(empresa); this.modalInsertarEmpresa() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                        <span style={{ float: 'righ' }} >Nueva empresa</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                        <label htmlFor='nombre'>nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChange} value={form ? form.nombre: ''} />
                            
                            <label htmlFor="contacto">contacto</label>
                            <input className="form-control" type="text" name='contacto' id='contacto' onChange={this.handleChange} value={form ? form.contacto: ''} />
                            
                            <label htmlFor='telefono'>telefono</label>
                            <input className='form-control' type='text' name='telefono' id='telefono' onChange={this.handleChange} value={form ? form.telefono:''} />
                            
                            <label htmlFor='direccion'>direccion</label>
                            <input className='form-control' type='text' name='direccion' id='direccion' onChange={this.handleChange} value={form ? form.direccion: ''} />
                            <label htmlFor='email'>email</label>
                            <input className='form-control' type='text' name='email' id='email' onChange={this.handleChange} value={form ? form.email: ''} />
                            <label htmlFor='imagen'>imagen</label>
                            <input className='form-control' type='text' name='imagen' id='imagen' onChange={this.handleChange} value={form ? form.imagen: ''} />
                            <label htmlFor='especialidad'>especialidad</label>
                            <input className='form-control' type='text' name='especialidad' id='especialidad' onChange={this.handleChange} value={form ? form.especialidad: ''} />
                         
                          {/* <label htmlFor='especialidad_id'>especialidad_id</label>
                            <input className='form-control' type='text' name='especialidad_id' id='especialidad_id' onChange={this.handleChange} value={form ? form.especialidad_id:''} /> */}
                        
                            
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-primary' onClick={() => this.peticionPostEmpresa()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPutEmpresa()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertarEmpresa()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Empresa;