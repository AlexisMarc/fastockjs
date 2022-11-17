import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { autorizacion, baseUrl } from '../../Utils/Api';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Col, FormFeedback, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';
const url = baseUrl + "empresa/";

export default class Empresa extends Component {

    //DATOS
    state= {}
    //PETICIÓN GET
    peticionGetEmpresa = () => {
        axios.get(url, autorizacion).then(response => {
            console.log(response)
            this.setState({ data: response.data, loading: false });
        }).catch(error => {
            console.log(error.message);
        })
    }
    //PETICIÓN POST
    peticionPostEmpresa = async () => {

        delete this.state.empresa.id;
        await axios.post(url, this.state.empresa, autorizacion).then(response => {
            this.modalInsertarEmpresa();
            this.peticionGetEmpresa();

        }).catch(error => {
            console.log(error.message);
        })

    }
    //PETICIÓN PUT
    peticionPutEmpresa = () => {
        axios.put(url + this.state.editempresa.id, this.state.editempresa, autorizacion).then(response => {
            this.modalInsertarEmpresa();
            this.peticionGetEmpresa();
            swal("Good job!", "You clicked the button!", "success");
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoEmpresa = (empresa) => {
        axios.put(url + 'estado/' + empresa.id, this.state.editEmpresa, autorizacion).then(response => {
            this.peticionGetEmpresa();
            swal("Good job!", "You clicked the button!", "success");
        }).catch(error => {
            console.log(error.message);
            swal("ERROR AL ELIMINAR", 'errores', "error");
        })
    }

     //MODAL DE INSERTAR
    modalInsertarEmpresa = () => {
        this.setState({ modalInsertarEmpresa: !this.state.modalInsertarEmpresa });
    }
    //MODAL DE EDITAR
    modalEditarEmpresa = () => {
        this.setState({ modalEditarEmpresa: !this.state.modalEditarEmpresa });
    }
    //SELECCIONAR EMPRESA PARA EDICIÓN
    seleccionarEmpresa = (empresa) => {
        this.setState({
            editempresa: {
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
        //INGRESO DE DATOS AL empresa

    handleChangeEmpresa = async e => {
        e.persist();
        await this.setState({
            empresa: {
                ...this.state.empresa,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.empresa);
    }
    //INGRESO DE DATOS AL EDITempresa

    handleChangeEditEmpresa = async e => {
        e.persist();
        await this.setState({
            editempresa: {
                ...this.state.editempresa,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.editempresa);
    }
    //FUNCION DE ARRANQUE
    componentDidMount() {
        this.peticionGetEmpresa();
    }
    constructor(props) {
        super(props);
        this.state = {
        data: [],
        modalInsertarEmpresa: false,
        modalEditarEmpresa: false,
        empresa: {
            nombre: '',
            contacto: '',
            telefono: 0,
            direccion: '',
            email: '',
            imagen: '',
            especialidad: 0
        },
        editempresa: {
            id:'',
            nombre: '',
            contacto: '',
            telefono: 0,
            direccion: '',
            email: '',
            imagen: '',
            especialidad: 0, 
            estado:''
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
    Botones(empresa) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={empresa.id} className='btn btn-primary' onClick={() => { this.seleccionarEmpresa(empresa); this.modalEditarEmpresa() }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() =>{} }><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => this.peticionEstadoEmpresa(empresa)}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
        const { editempresa, data } = this.state;
        const header = this.renderHeader();
        const toggle = () => this.modalInsertarEmpresa();
        
        const toggle2 = () => this.modalEditarEmpresa();
        return (
            <div className="datatable-doc-demo">
                <div className="flex justify-content-between align-items-center">
                    <h5 className="m-0 h5">empresa</h5>
                    <button className='btn btn-primary'onClick={() => { this.setState({ empresa: null, tipoModal: 'insertar' }); this.modalInsertarEmpresa() }}><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
                </div>
                <br />
                <div className='card'>
                    <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
                        dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
                        filters={this.state.filters} loading={this.state.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Preveedores no encontrados..."
                        currentPageReportTemplate="Registro {first} - {last} de {totalRecords} empresaes">
                        <Column field="nombre" header="Nombre" />
                        <Column field="contacto" header="Contacto" />
                        <Column field="telefono" header="Telefono" />
                        <Column field="dirreccion" header="Direccion" />
                        <Column field="email" header="Email" />
                        <Column field="imagen" header="Imagen" />
                        <Column field="especialidad" header="Especialidad" />
                        <Column field="estado" header="Botones" body={this.Botones} />
                    </DataTable>
                    </div>
                {/*  MODAL INSERTAR */}
                <Modal isOpen={this.state.modalInsertarEmpresa} toggle={toggle} size='lg'>
                <ModalHeader toggle={toggle}>
                        <span>Agregar Empresa</span>
                        <button type="button" className="close" onClick={() => this.modalInsertarEmpresa()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>

                    <ModalBody>
                    <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input valid type='text' name='nombre' id='nombre' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Nombre del nombre del proveedor.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Contacto del la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='telefono'>Telefono:</Label>
                                    <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                    telefono de la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Dirección del proveedor.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='email'>Email:</Label>
                                    <Input invalid type='text' name='email' id='email' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                    Email de la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='imagen'>Imagen:</Label>
                                    <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Imagen de la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                <Col md={12}>
                                    <Label htmlFor='especialidad'>Especialidad:</Label>
                                    <Input invalid type='text' name='especialidad' id='especialidad' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                    especialidad.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                            <button className='btn btn-primary' onClick={() => this.peticionPostEmpresa()}>
                                Insertar
                            </button>
                        <button className='btn btn-danger' onClick={() => this.modalInsertarEmpresa()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>


                {/*  MODAL Editar*/}
                <Modal isOpen={this.state.modalEditarEmpresa}>
                <ModalHeader toggle2={toggle2}>
                        <span>Editar Empresa</span>
                        <button type="button" className="close" onClick={() => this.modalEditarEmpresa()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>
                    <ModalBody>
                    <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input valid type='text' name='nombre' id='nombre' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Nombre del nombre del proveedor.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Contacto del la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>

                            <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='telefono'>Telefono:</Label>
                                    <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                    telefono de la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Dirección del proveedor.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                <Col md={6}>
                                    <Label htmlFor='email'>Email:</Label>
                                    <Input invalid type='text' name='email' id='email' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                    Email de la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='imagen'>Imagen:</Label>
                                    <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                        Imagen de la empresa.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                <Col md={12}>
                                    <Label htmlFor='especialidad'>Especialidad:</Label>
                                    <Input invalid type='text' name='especialidad' id='especialidad' onChange={this.handleChangeEmpresa} />
                                    <FormText>
                                    especialidad.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                </Row>
                            </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                    <button className='btn btn-primary' onClick={() => this.peticionPutEmpresa()}>
                            Actualizar
                        </button>
                        <button className='btn btn-danger' onClick={() => this.modalEditarEmpresa()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

