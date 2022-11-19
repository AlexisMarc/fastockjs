import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode} from 'primereact/api';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faEye, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert, Badge, Button, Col, Collapse, FormFeedback, FormGroup, FormText, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { autorizacion, baseUrl } from '../../Utils/Api';
import swal from 'sweetalert';


import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

//URL PRINCIPAL
const url = baseUrl + 'proveedor/';

export default class Proveedor extends Component {

    //DATOS
    state = {}

    //PETICIÓN GET
    peticionGetProveedor = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data, loading: false });
        }).catch(error => {
            console.log(error.message);
            this.setState({ loading: false });
            swal({title: "ERROR AL CONSULTAR", text: " ",icon: "error",buttons:false, timer:1500})
        })
    }

    //PETICIÓN GET INSUMOS
    peticionGetInsumo = (id) => {
        axios.get(url + 'insumo/' + id, autorizacion).then(response => {
            this.setState({ datainsumos: response.data });
        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL CONSULTAR INSUMOS", text: " ",icon: "error",buttons:false, timer:1500})
        })
    }



    //PETICIÓN POST
    peticionPostProveedor = async () => {

        await axios.post(url, this.state.form, autorizacion).then(response => {
            this.modalInsertarProveedor();
            this.peticionGetProveedor();

        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL REGISTRAR", text: " ",icon: "error",buttons:false, timer:1500})
        })

    }

    //PETICIÓN PUT
    peticionPutProveedor = () => {
        axios.put(url + this.state.editForm.id, this.state.editForm, autorizacion).then(response => {
            this.modalEditarProveedor();
            this.peticionGetProveedor();
            swal({title: "Proveedor "+response.data.nombre+" editado", text: " ",icon: "success",buttons:false, timer:1500})
        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL EDITAR", text: " ",icon: "error",buttons:false, timer:1500})
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoProveedor = (proveedor) => {
        axios.put(url + 'estado/' + proveedor.id, this.state.editForm, autorizacion).then(response => {
            this.peticionGetProveedor();
            swal({title: "Proveedor "+response.data.nombre+" eliminado", text: " ",icon: "success",buttons:false, timer:1500})
        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL ELIMINAR", text: " ",icon: "error",buttons:false, timer:1500})
        })
    }

    //MODAL DE INSERTAR
    modalInsertarProveedor = () => {
        this.setState({ modalInsertarProveedor: !this.state.modalInsertarProveedor });
    }

    //MODAL DE VIEW
    modalViewProveedor = () => {
        this.setState({ modalViewProveedor: !this.state.modalViewProveedor });
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

    //PASAR INSUMO
    pasarInsumo = (insumo) => {
        this.setState({
            datosinsumo: {
                nombre: insumo.nombre,
                material: insumo.material,
                imagen: insumo.imagen,
                tipo: insumo.tipo,
                inventario: insumo.inventario
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
            datainsumos: [],
            estadoinsumos: false,
            modalInsertarProveedor: false,
            modalEditarProveedor: false,
            modalViewProveedor: false,
            insumo: false,
            modelinsumo: false,
            datosinsumo: {
                nombre: '',
                material: '',
                imagen: '',
                tipo: [],
                inventario: false
            },
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
            <button value={proveedor.id} className='btn btn-primary' onClick={() => { swal({title: "¿Desea editar al proveedor "+proveedor.nombre+"?",icon: "warning",buttons: ["Cancelar", "Editar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.seleccionarProveedor(proveedor); this.modalEditarProveedor()}});  }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() => {  this.seleccionarProveedor(proveedor); this.modalViewProveedor() }} ><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => {swal({title: "¿Desea eliminar al proveedor "+proveedor.nombre+"?",icon: "warning",buttons: ["Cancelar", "Eliminar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.peticionEstadoProveedor(proveedor)}});}}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
        const { editForm, data, datainsumos, datosinsumo } = this.state;
        const header = this.renderHeader();
        const stiloimg = { "width": "25px", "borderRadius": "20%", "height": "25px" };
        const toggle = () => this.modalInsertarProveedor();
        const toggle2 = () => this.modalEditarProveedor();
        const toggle3 = () => this.modalViewProveedor();
        const insumo = () => this.setState({ insumo: !this.state.insumo });
        const modelinsumo = () => this.setState({ modelinsumo: !this.state.modelinsumo });

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
                        <Column field="nombre" header="Nombre" />
                        <Column field="contacto" header="Contacto" />
                        <Column field="email" header="Email" />
                        <Column field="estado" header="Botones" body={this.Botones} />

                    </DataTable>
                </div>
                {/* MODAL DE REGISTRAR */}
                <Modal isOpen={this.state.modalInsertarProveedor} toggle={toggle} size='lg'>
                    <ModalHeader toggle={toggle}>
                        <span>Agregar Proveedor</span>
                        <button type="button" className="close" onClick={() => this.modalInsertarProveedor()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>

                    <ModalBody>

                        <FormGroup>
                            <Row>
                                <Col md={6}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input invalid type='text' name='nombre' id='nombre' onChange={this.handleChangeProveedor} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeProveedor} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>

                        <FormGroup>
                            <Row>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeProveedor} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='telefono'>Teléfono:</Label>
                                    <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeProveedor} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <Label htmlFor='email'>Email:</Label>
                                    <Input invalid type='text' name='email' id='email' onChange={this.handleChangeProveedor} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
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
                <Modal isOpen={this.state.modalEditarProveedor} toggle={toggle2} size='lg'>
                    <ModalHeader >
                        <span>Editar Proveedor</span>
                        <button type="button" className="close" onClick={() => this.modalEditarProveedor()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Row>
                                <Col md={6}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input invalid type='text' name='nombre' id='nombre' onChange={this.handleChangeEditProveedor} value={editForm.nombre || ''} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeEditProveedor} value={editForm.contacto || ''} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>

                        <FormGroup>
                            <Row>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeEditProveedor} value={editForm.direccion || ''} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='telefono'>Teléfono:</Label>
                                    <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeEditProveedor} value={editForm.telefono || ''} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <Label htmlFor='email'>Email:</Label>
                                    <Input invalid type='text' name='email' id='email' onChange={this.handleChangeEditProveedor} value={editForm.email || ''} />
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
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

                {/* MODAL DE VISTA */}
                <Modal isOpen={this.state.modalViewProveedor} toggle={() => { this.setState({ datainsumos: [], insumo: false }); toggle3();  }}>
                    <ModalHeader >
                        <div><br /><h3>Proveedor {editForm.nombre}</h3></div>
                        <button type="button" className="close" onClick={() => {this.modalViewProveedor(); this.setState({ datainsumos: [], insumo: false })}}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Row>
                                <Col md={12} >
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <p>Nombr:</p> <h5>{editForm.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Contacto:</p> <h5>{editForm.contacto}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Dirección:</p> <h5>{editForm.direccion}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Teléfono:</p><h5>{editForm.telefono}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Email:</p> <h5>{editForm.email}</h5>
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <div>
                                                <Button color="primary" onClick={() => { this.peticionGetInsumo(editForm.id); insumo() }} >
                                                    Insumos de {editForm.nombre}
                                                </Button>

                                            </div>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Collapse horizontal isOpen={this.state.insumo}>
                                                <ListGroup>
                                                    {datainsumos.length > 0 ?
                                                        datainsumos.map((insumo, index) => {
                                                            return (
                                                                <ListGroupItem action key={index} onClick={() => { modelinsumo(); this.pasarInsumo(insumo) }} style={{ "cursor": "pointer" }}>
                                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                        {insumo.imagen ?
                                                                            <img src={baseUrl + "files/" + insumo.imagen} style={stiloimg} alt={insumo.id} />
                                                                            : <img src={baseUrl + "files/error.png"} style={stiloimg} alt={insumo.id} />
                                                                        }

                                                                        <p>{insumo.nombre}</p>
                                                                    </div>
                                                                </ListGroupItem>
                                                            )
                                                        }) :

                                                        <Alert color="primary">
                                                            No hay insumos registrados con el proveedor
                                                        </Alert>
                                                    }
                                                </ListGroup>
                                            </Collapse>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Col>

                            </Row>
                            <Modal isOpen={this.state.modelinsumo} toggle={modelinsumo} centered>
                                <ModalHeader toggle={modelinsumo}>
                                    <div><br /><h3>{datosinsumo.nombre}</h3></div>
                                    <button type="button" className="close" onClick={modelinsumo}>
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        <ListGroupItem style={{"display":"flex", "justifyContent": "center"}}>
                                            {datosinsumo.imagen
                                                ? <img src={baseUrl + "files/" + datosinsumo.imagen} style={{"width" : "70%", "borderRadius": "10%"}} alt={datosinsumo.id} />
                                                : <img src={baseUrl + "files/error.png"} style={{"width" : "70%", "borderRadius": "10%"}} alt={datosinsumo.id} />
                                            }

                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Nombre:</p> <h5>{datosinsumo.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Material:</p> <h5>{datosinsumo.material}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Inventario:</p> <h5>{!datosinsumo.inventario ? <Badge color="primary"> Tiene inventario</Badge> : <Badge color="danger">Sin inventario</Badge>}</h5>
                                        </ListGroupItem>
                                    </ListGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={modelinsumo}>
                                        Cerrar
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => { this.modalViewProveedor(); this.setState({ datainsumos: [], insumo: false  }) }}>
                            Cerrar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}