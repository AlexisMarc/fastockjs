import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
    state= {}

    //PETICIÓN GET
    peticionGetProveedor = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data, loading: false });
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
    //CONSTRUCTOR
    constructor(props) {
        super(props);
        this.state = {
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
            },
            customers: null,
            selectedCustomers: null,
            filters: {
                    'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
            globalFilterValue: '',
            loading: true
        }
        this.Botones = this.Botones.bind(this);
        this.onGlobalFilterChange = this.onGlobalFilterChange.bind(this);
    }

    //RENDERIZAR BOTONES
    Botones(proveedor) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={proveedor.id} className='btn btn-primary' onClick={() => { this.seleccionarProveedor(proveedor); this.modalEditarProveedor() }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() =>{} }><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => this.peticionEstadoProveedor(proveedor)}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>;
    }

    //FILTRADO GLOBAL
    onGlobalFilterChange(e) {
        const value = e.target.value;
        let filters = { ...this.state.filters };
        filters['global'].value = value;
        console.log(value)
        this.setState({filters, globalFilterValue: value });
    }

    //RENDERIZAR ENCABEZADO DE LA DATATABLE
    renderHeader() {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0 h5"></h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        )
    }

    render() {
        const { editForm, data } = this.state;
        const header = this.renderHeader();
        return (
            <div className="datatable-doc-demo">
                <div className="flex justify-content-between align-items-center">
                    <h5 className="m-0 h5">Proveedor</h5>
                    <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarProveedor() }}><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
                </div>
                <br />
                <div className='card'>
                    <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
                        dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
                        filters={this.state.filters} loading={this.state.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Preveedores no encontrados..."
                        currentPageReportTemplate="Registro {first} - {last} de {totalRecords} Proveedores">
                        <Column selectionMode="multiple" selectionAriaLabel="name" headerStyle={{ width: '1em' }}></Column>
                        <Column field="nombre" header="Nombre" />
                        <Column field="contacto" header="Contacto" />
                        <Column field="email" header="Email" />
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