import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { autorizacion, baseUrl } from '../../Utils/Api';
import swal from 'sweetalert';

import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

//URL PRINCIPAL
const url = baseUrl + 'proveedor/';

export default class DataTableResponsiveDemo extends Component {

    //DATOS
    state = {
        data: [],
        modalInsertarProveedor: false,
        modalEditarProveedor: false,
        form: {
            nombre: '',
            contacto: '',
            telefono: '',
            direccion: '',
            email: ''
        },
        editForm: {
            id: '',
            nombre: '',
            contacto: '',
            telefono: '',
            direccion: '',
            email: '',
            estado: ''
        }
    }

    //PETICIÓN GET
    peticionGetProveedor = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data });
        }).catch(error => {
            console.log(error.message);
        })
    }

    //PETICIÓN POST
    peticionPostProveedor = async () => {

        await axios.post(url, this.state.form, autorizacion).then(response => {
            this.modalInsertarProveedor();
            this.peticionGetProveedor();

        }).catch(error => {
            console.log(error.message);
        })

    }

    //PETICIÓN PUT
    peticionPutProveedor = () => {
        axios.put(url + this.state.editForm.id, this.state.editForm, autorizacion).then(response => {
            this.modalEditarProveedor();
            this.peticionGetProveedor();

            swal("Good job!", "You clicked the button!", "success");
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoProveedor = (proveedor) => {
        axios.put(url + 'estado/' + proveedor.id, this.state.editForm, autorizacion).then(response => {
            this.peticionGetProveedor();
            swal("Good job!", "You clicked the button!", "success");
        }).catch(error => {
            console.log(error.message);
            swal("ERROR AL ELIMINAR", 'errores', "error");
        })
    }

    //MODAL DE INSERTAR
    modalInsertarProveedor = () => {
        this.setState({ modalInsertarProveedor: !this.state.modalInsertarProveedor });
    }

    //MODAL DE EDITAR
    modalEditarProveedor = () => {
        this.setState({ modalEditarProveedor: !this.state.modalEditarProveedor });
    }

    //SELECCIONAR PROVEEDOR PARA EDICIÓN
    seleccionarProveedor = (proveedor) => {
        this.setState({
            editForm: {
                id: proveedor.id,
                nombre: proveedor.nombre,
                contacto: proveedor.contacto,
                telefono: proveedor.telefono,
                direccion: proveedor.direccion,
                email: proveedor.email,
                estado: proveedor.estado
            }
        })
    }

    //INGRESO DE DATOS AL FORM
    handleChangeProveedor = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    //INGRESO DE DATOS AL EDITFORM
    handleChangeEditProveedor = async e => {
        e.persist();
        await this.setState({
            editForm: {
                ...this.state.editForm,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.editForm);
    }

    //FUNCION DE ARRANQUE
    componentDidMount() {
        this.peticionGetProveedor();
    }

    constructor(props) {
        super(props);
        this.Botones = this.Botones.bind(this);

    }

    Botones(proveedor) {
        return <div>
            <button value={proveedor.id} className='btn btn-primary' onClick={() => { this.seleccionarProveedor(proveedor); this.modalEditarProveedor() }}><FontAwesomeIcon icon={faEdit} /></button>
            {' '}
            <button className='btn btn-danger' onClick={() => this.peticionEstadoProveedor(proveedor)}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>;
    }


    render() {
        const { form, editForm, data } = this.state;
        return (
            <div>
                <br />
                <div style={{'display': 'flex','alignItems': 'end','justifyContent': 'end'}}>
                    <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarProveedor() }}>Agregar Proveedor</button>
                </div>
                <br />
                <div className="card">
                    <DataTable value={data} header="Proveedor" responsiveLayout="stack" breakpoint="800px" paginator rows={10}>
                        <Column field="nombre" header="Nombre" sortable filter />
                        <Column field="contacto" header="Contacto" sortable />
                        <Column field="direccion" header="Dirección" sortable />
                        <Column field="email" header="Email" sortable />
                        <Column field="estado" header="Botones" body={this.Botones} />

                    </DataTable>
                </div>
                {/* MODAL DE EDITAR */}
                <Modal isOpen={this.state.modalInsertarProveedor}>
                    <ModalHeader>
                        <span>Agregar Proveedor</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className='form-group'>
                            <label htmlFor='contacto'>contacto</label>
                            <input className='form-control' type='text' name='contacto' id='contacto' onChange={this.handleChangeProveedor} />
                            <br />
                            <label htmlFor='direccion'>direccion</label>
                            <input className='form-control' type='text' name='direccion' id='direccion' onChange={this.handleChangeProveedor} />
                            <br />
                            <label htmlFor='email'>email</label>
                            <input className='form-control' type='text' name='email' id='email' onChange={this.handleChangeProveedor} />
                            <br />
                            <label htmlFor='nombre'>nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChangeProveedor} />
                            <br />
                            <label htmlFor='telefono'>telefono</label>
                            <input className='form-control' type='text' name='telefono' id='telefono' onChange={this.handleChangeProveedor} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostProveedor()}>
                            Insertar
                        </button>
                        <button className='btn btn-danger' onClick={() => this.modalInsertarProveedor()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>

                {/* MODAL DE EDITAR */}
                <Modal isOpen={this.state.modalEditarProveedor}>
                    <ModalHeader >
                        <span>Editar Proveedor</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className='form-group'>

                            <label htmlFor='nombre'>Nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChangeEditProveedor} value={editForm.nombre || ''} />
                            <br />
                            <label htmlFor='Contacto'>Contacto</label>
                            <input className='form-control' type='text' name='contacto' id='contacto' onChange={this.handleChangeEditProveedor} value={editForm.contacto || ''} />
                            <br />
                            <label htmlFor='telefono'>Telefono</label>
                            <input className='form-control' type='text' name='telefono' id='telefono' onChange={this.handleChangeEditProveedor} value={editForm.telefono || ''} />
                            <br />
                            <label htmlFor='direccion'>Dirección</label>
                            <input className='form-control' type='text' name='direccion' id='direccion' onChange={this.handleChangeEditProveedor} value={editForm.direccion || ''} />
                            <br />
                            <label htmlFor='email'>Email</label>
                            <input className='form-control' type='text' name='email' id='email' onChange={this.handleChangeEditProveedor} value={editForm.email || ''} />


                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPutProveedor()}>
                            Actualizar
                        </button>
                        <button className='btn btn-danger' onClick={() => this.modalEditarProveedor()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}