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
        form: {
            id: '',
            descripcion: '',
            estado: '', 
            material: '',
            nombre: '',
            proveedor_id: '',
            telefono: ''
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
    seleccionarInsumo = (insumo) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: insumo.id,
                descripcion: insumo.descripcion,
                nombre: insumo.nombre,
                material: insumo.material,
                estado: insumo.estado,
                proveedor_id: insumo.proveedor_id,
                identificacion: insumo.identificacion
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
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Insumo</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>descripcion</th>
                            <th>nombre</th>
                            <th>material</th>
                            <th>estado</th>
                            <th>proveedor_id</th>
                            <th>Acciones</th>

                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(insumo => {
                            return (
                                <tr>
                                    <td>{insumo.id}</td>
                                    <td>{insumo.descripcion}</td>
                                    <td>{insumo.nombre}</td>
                                    <td>{insumo.material}</td>
                                    <td>{insumo.estado}</td>
                                    <td>{insumo.proveedor_id}</td>
                                    <td>{insumo.telefono}</td>
                                    <td>
                                    <button className='btn btn-primary' onClick={() => { this.seleccionarInsumo(insumo); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                            <label htmlFor="descripcion">descripcion</label>
                            <input className="form-control" type="text" name='descripcion' id='descripcion' onChange={this.handleChange} value={form ? form.descripcion: ''} />
                            <br />
                            <label htmlFor='nombre'>nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChange} value={form ? form.nombre:''} />
                            <br />
                            <label htmlFor='material'>material</label>
                            <input className='form-control' type='text' name='material' id='material' onChange={this.handleChange} value={form ? form.material:''} />
                            <br />
                            <label htmlFor='estado'>estado</label>
                            <input className='form-control' type='text' name='estado' id='estado' onChange={this.handleChange} value={form ? form.estado: ''} />
                            <br />
                            <label htmlFor='proveedor_id'>proveedor_id</label>
                            <input className='form-control' type='text' name='proveedor_id' id='proveedor_id' onChange={this.handleChange} value={form ? form.proveedor_id: ''} />
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

export default Insumo;