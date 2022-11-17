import React, { Component } from 'react';
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { autorizacion, baseUrl } from '../../Utils/Api';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import swal from 'sweetalert';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

const url = "http://localhost:8083/api/tipo";



class Tipo extends Component {

    state = {
        data: [],
        modalInsertarTipoTipo: false,
        form: {
            nombre:'',
            descripcion: '',
            filtro: ''
        }
    }


    peticionGetTipo= () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data});
        }).catch(error => {
            console.log(error.message);
        })
    }

    peticionPostTipo = async () => {

        delete this.state.form.id;
        await axios.post(url, this.state.form).then(response => {
            this.modalInsertarTipo();
            this.peticionGetTipo();

        }).catch(error => {
            console.log(error.message);
        })
    }
    peticionPutTipo = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertarTipo();
            this.peticionGetTipo();
        })
    }
    modalInsertarTipo = () => {
        this.setState({ modalInsertarTipo: !this.state.modalInsertarTipo });
    }
    seleccionarTipo = (tipo) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                nombre: tipo.nombre,
                descripción: tipo.descripcion,
                filtro: tipo.filtro
            }
        })
    }
    handleChangeTipo = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMountTipo() {
        this.peticionGetTipo();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarTipo() }}>Agregar Tipo</button>
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
                        {this.state.data.map(tipo => {
                            return (
                                <tr>
                                    <td>{tipo.nombre}</td>
                                    <td>{tipo.descripcion}</td>
                                    <td>{tipo.filtro}</td>
                                    <td>
                                    <button className='btn btn-primary' onClick={() => { this.seleccionarTipo(tipo); this.modalInsertarTipo() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {" "}
                                        <button className='btn btn-danger'><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>


                <Modal isOpen={this.state.modalInsertarTipo}>
                    <ModalHeader style={{ display: "block" }}>
                        <span style={{ float: 'righ' }} >x</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChangeTipo} value={form ? form.nombre:''} />
                            <div />
                            <label htmlFor='descripcion'>Descripción</label>
                            <input className='form-control' type='text' name='descripcion' id='descripcion' onChange={this.handleChangeTipo} value={form ? form.descripcion:''} />
                            <label htmlFor='filtro'>filtro</label>
                            <input className='form-control' type='text' name='filtro' id='filtro' onChange={this.handleChangeTipo} value={form ? form.filtro:''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-primary' onClick={() => this.peticionPostTipo()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPutTipo()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertarTipo()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Tipo;