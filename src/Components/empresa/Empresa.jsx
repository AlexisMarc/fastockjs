import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClose } from '@fortawesome/free-solid-svg-icons';
import { autorizacion, baseUrl } from '../../Utils/Api';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Alert, Badge, Button, Collapse, ListGroup, ListGroupItem } from 'reactstrap';
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
    //PETICIÓN GET ESPECIALIDAD
    peticionGetEspecialidad = (id) => {    
        axios.get(url + 'especialidad/'+ id, autorizacion).then(response => {
            this.setState({ dataespecialidad: response.data });
        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL CONSULTAR ESPECIALIDAD", text: " ",icon: "error",buttons:false, timer:1500})
        })
    }
    //PETICIÓN POST
    peticionPostEmpresa = async () => {

        await axios.post(url, this.state.empresa, autorizacion).then(response => {
            this.modalInsertarEmpresa();
            this.peticionGetEmpresa();
            

        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL REGISTRAR", text: " ",icon: "error",buttons:false, timer:1500})
        })

    }
    //PETICIÓN PUT
    peticionPutEmpresa = () => {
        axios.put(url + this.state.editempresa.id, this.state.editempresa, autorizacion).then(response => {
            this.modalEditarEmpresa();
            this.peticionGetEmpresa();
            swal({title: "Empresa "+response.data.nombre+" editado", text: " ",icon: "success",buttons:false, timer:1500})
        })
        .catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL EDITAR", text: " ",icon: "error",buttons:false, timer:1500})
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoEmpresa = (empresa) => {
        axios.put(url + 'estado/' + empresa.id, this.state.editEmpresa, autorizacion).then(response => {
            this.peticionGetEmpresa();
            swal({title: "Empresa "+response.data.nombre+" eliminado", text: " ",icon: "success",buttons:false, timer:1500})
        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL ELIMINAR", text: " ",icon: "error",buttons:false, timer:1500})
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
    //MODAL DE VIEW
    modalViewEmpresa = () => {
        this.setState({ modalViewEmpresa: !this.state.modalViewEmpresa });
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
        modalViewEmpresa: false,
        dataespecialidad: [],
        datosespecialidad:{
            nombre:'',
            descripcion:''
        },
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
                        <button value={empresa.id} className='btn btn-primary' onClick={() => { swal({title: "¿Desea editar al Empresa "+Empresa.nombre+"?",icon: "warning",buttons: ["Cancelar", "Editar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.seleccionarEmpresa(empresa); this.modalEditarEmpresa()}});  }}><FontAwesomeIcon icon={faEdit} /></button>
                        <button className='btn btn-info' onClick={() => {  this.seleccionarEmpresa(empresa); this.modalViewEmpresa() }} ><FontAwesomeIcon icon={faEye} /></button>
                        <button className='btn btn-danger' onClick={() => {swal({title: "¿Desea eliminar al empresa "+empresa.nombre+"?",icon: "warning",buttons: ["Cancelar", "Eliminar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.peticionEstadoEmpresa(empresa)}});}}><FontAwesomeIcon icon={faTrashAlt} /></button>

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
        const { editempresa, data,  dataespecialidad } = this.state;
        const header = this.renderHeader();
        const toggle = () => this.modalInsertarEmpresa();
        const toggle2 = () => this.modalEditarEmpresa();
        const toggle3 = () => this.modalViewEmpresa();
        const especialidad = () => this.setState({ especialidad: !this.state.especialidad });
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
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeEmpresa} />
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
                                    
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeEmpresa} />
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
                                    
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='imagen'>Imagen:</Label>
                                    <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeEmpresa} />
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
                <Modal isOpen={this.state.modalEditarEmpresa} toggle={toggle2} size='lg'>
                <ModalHeader>
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
                                    <Input valid type='text' name='nombre' id='nombre' onChange={this.handleChangeEditEmpresa} value={editempresa.nombre || ''}/>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeEditEmpresa} value={editempresa.contacto || ''}/>
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
                                    <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeEditEmpresa} value={editempresa.telefono || ''} />
                                    
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeEditEmpresa} value={editempresa.direccion || ''}/>
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
                                    <Input invalid type='text' name='email' id='email' onChange={this.handleChangeEditEmpresa} value={editempresa.contacto || ''}/>
                                    
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='imagen'>Imagen:</Label>
                                    <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeEditEmpresa} value={editempresa.imagen || ''}/>
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
                                    <Input invalid type='text' name='especialidad' id='especialidad' onChange={this.handleChangeEmpresa} value={editempresa.especialidad || ''} />
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
                {/* MODAL DE VISTA EMPRESA */}
                <Modal isOpen={this.state.modalViewEmpresa} toggle={() => { toggle3(); this.setState({ dataespecialidad: [], especialidad: false }) }}>
                    <ModalHeader >
                        <div><br /><h3>Empresa {editempresa.nombre}</h3></div>
                        <button type="button" className="close" onClick={() => this.modalViewEmpresa()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Row>
                                <Col md={12} >
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <p>Nombre:</p> <h5>{editempresa.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Contacto:</p> <h5>{editempresa.contacto}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Dirección:</p> <h5>{editempresa.direccion}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Teléfono:</p><h5>{editempresa.telefono}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Email:</p> <h5>{editempresa.email}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Imagen:</p> <h5>{editempresa.imagen}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Especialidad:</p> <h5>{editempresa.especialidad}</h5>
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <div>
                                                <Button color="primary" onClick={() => { this.peticionGetEspecialidad(editempresa.id); especialidad() }} >
                                                    especialidads de {editempresa.nombre}
                                                </Button>

                                            </div>
                                        </ListGroupItem>
                                        
                                    </ListGroup>
                                </Col>

                            </Row>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => { this.modalViewEmpresa(); this.setState({ dataespecialidad: [], especialidad: false  }) }}>
                            Cerrar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

