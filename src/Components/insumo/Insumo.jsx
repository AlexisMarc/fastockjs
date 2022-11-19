import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faEye, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, FormFeedback, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { autorizacion, baseUrl } from '../../Utils/Api';
import swal from 'sweetalert';


import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

//URL PRINCIPAL
const url = baseUrl + 'insumo/';

export default class Insumo extends Component {

    //DATOS
    state = {}

    //PETICIÓN GET
    peticionGetInsumo = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data, loading: false });
        }).catch(error => {
            console.log(error.message);
        })
    }

    //PETICIÓN POST
    peticionPostInsumo = async () => {

        await axios.post(url, this.state.form, autorizacion).then(response => {
            this.modalInsertarInsumo();
            this.peticionGetInsumo();

        }).catch(error => {
            console.log(error.message);
        })

    }

    //PETICIÓN PUT
    peticionPutInsumo = () => {
        axios.put(url + this.state.editForm.id, this.state.editForm, autorizacion).then(response => {
            this.modalEditarInsumo();
            this.peticionGetInsumo();

            swal("Good job!", "You clicked the button!", "success");
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoInsumo = (insumo) => {
        axios.put(url + 'estado/' +insumo.id, this.state.editForm, autorizacion).then(response => {
            this.peticionGetInsumo();
            swal("Good job!", "You clicked the button!", "success");
        }).catch(error => {
            console.log(error.message);
            swal("ERROR AL ELIMINAR", 'errores', "error");
        })
    }

    //MODAL DE INSERTAR
    modalInsertarInsumo = () => {
        this.setState({ modalInsertarInsumo: !this.state.modalInsertarInsumo });
    }

    //MODAL DE EDITAR
    modalEditarInsumo = () => {
        this.setState({ modalEditarInsumo: !this.state.modalEditarInsumo });
    }

    //SELECCIONAR INSUMO PARA EDICIÓN
    seleccionarInsumo = (insumo) => {
        this.setState({
            editForm: {
                id: insumo.id,
                nombre: insumo.nombre,
                contacto: insumo.contacto,
                telefono: insumo.telefono,
                direccion: insumo.direccion,
                email: insumo.email,
                estado: insumo.estado
            }
        })
    }

    //INGRESO DE DATOS AL FORM
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

    //INGRESO DE DATOS AL EDITFORM
    handleChangeEditInsumo = async e => {
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
        this.peticionGetInsumo();
    }
    //CONSTRUCTOR

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalInsertarInsumo: false,
            modalEditarInsumo: false,
            form: {
                nombre: '',
                material: '',
                tipo: '',
                proveedor: '',
                imagen: ''

            },
            editForm: {
                id: '',
                nombre: '',
                estado: '',
                material: '',
                direccion: '',
                tipo: '',
                proveedor: '',
                imagen:''
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
    Botones(insumo) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={insumo.id} className='btn btn-primary' onClick={() => { swal({title: "¿Desea editar al insumo "+insumo.nombre+"?",icon: "warning",buttons: ["Cancelar", "Editar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.seleccionarInsumo(insumo); this.modalEditarInsumo()}});  }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() => {  this.seleccionarInsumo(insumo); this.modalViewInsumo() }} ><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => {swal({title: "¿Desea eliminar al insumo "+insumo.nombre+"?",icon: "warning",buttons: ["Cancelar", "Eliminar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.peticionEstadoInsumo(insumo)}});}}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>;
    }

    //FILTRADO GLOBAL
    onGlobalFilterChange(e) {
        const value = e.target.value;
        let filters = { ...this.state.filters };
        filters['global'].value = value;
        console.log(value)
        this.setState({ filters, globalFilterValue: value });
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
        const toggle = () => this.modalInsertarInsumo();

        return (
            <div className="datatable-doc-demo">
                <div className="flex justify-content-between align-items-center">
                    <h5 className="m-0 h5">Insumo</h5>
                    <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarInsumo() }}><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
                </div>
                <br />
                <div className='card'>
                    <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
                        dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
                        filters={this.state.filters} loading={this.state.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Preveedores no encontrados..."
                        currentPageReportTemplate="Registro {first} - {last} de {totalRecords} Proveedores">
                        <Column field="nombre" header="Nombre" />
                        <Column field="material" header="Material" />
                        <Column field="imagen" header="Imagen" />
                        <Column field="estado" header="Estado" />
                        <Column field="tipo" header="Tipo" />
                        <Column field="proveedor" header="Proveedor" />
                        <Column field="idproveedor" header="Id Proveedor" body={this.Botones} />

                    </DataTable>
                </div>
                {/* MODAL DE REGISTRAR */}
                <Modal isOpen={this.state.modalInsertarInsumo} toggle={toggle} size='lg'>
                    <ModalHeader toggle={toggle}>
                        <span>Agregar Insumo</span>
                        <button type="button" className="close" onClick={() => this.modalInsertarInsumo()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>

                    <ModalBody>

                            <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input valid type='text' name='nombre' id='nombre' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                        Nombre del insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='material'>Material:</Label>
                                    <Input invalid type='text' name='material' id='material' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                        Material del insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='tipo'>Tipo:</Label>
                                    <Input invalid type='text' name='tipo' id='tipo' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                       Tipo del insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='proveedor'>Proveedor:</Label>
                                    <Input invalid type='text' name='proveedor' id='proveedor' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                       Proveedor del insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='insumo'>Imagen:</Label>
                                    <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                       Imagen del insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostInsumo()}>
                            Insertar
                        </button>
                        <button className='btn btn-danger' onClick={() => this.modalInsertarInsumo()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>

                {/* MODAL DE EDITAR */}
                <Modal isOpen={this.state.modalEditarInsumo}>
                    <ModalHeader >
                        <span>Editar Insumo</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className='form-group'>

                            <label htmlFor='id'>Id</label>
                            <input className='form-control' type='text' name='id' id='id' onChange={this.handleChangeEditInsumo} value={editForm.id || ''} />
                            <br />
                            <label htmlFor='nombre'>Nombre</label>
                            <input className='form-control' type='text' name='nombre' id='nombre' onChange={this.handleChangeEditInsumo} value={editForm.nombre || ''} />
                            <br />
                            <label htmlFor='estado'>Estado</label>
                            <input className='form-control' type='text' name='estado' id='estado' onChange={this.handleChangeEditInsumo} value={editForm.estado || ''} />
                            <br />Insumo
                            <label htmlFor='material'>Material</label>
                            <input className='form-control' type='text' name='material' id='material' onChange={this.handleChangeEditInsumo} value={editForm.material || ''} />
                            <br />
                            <label htmlFor='tipo'>Tipo</label>
                            <input className='form-control' type='text' name='tipo' id='tipo' onChange={this.handleChangeEditInsumo} value={editForm.tipo || ''} />
                            <br />
                            <label htmlFor='proveedor'>Proveedor</label>
                            <input className='form-control' type='text' name='proveedor' id='proveedor' onChange={this.handleChangeEditInsumo} value={editForm.proveedor || ''} />
                            <label htmlFor='imagen'>Imagen</label>
                            <input className='form-control' type='text' name='imagen' id='imagen' onChange={this.handleChangeEditInsumo} value={editForm.imagen || ''} />


                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPutInsumo()}>
                            Actualizar
                        </button>
                        <button className='btn btn-danger' onClick={() => this.modalEditarInsumo()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}