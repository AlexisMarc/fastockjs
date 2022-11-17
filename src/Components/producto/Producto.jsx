import React, { Component } from 'react';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Col, FormFeedback, FormGroup, FormText, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import Cookies from 'universal-cookie';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { autorizacion, baseUrl } from '../../Utils/Api';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons';
import { InputText } from 'primereact/inputtext';
import swal from 'sweetalert';


import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

//URL PRINCIPAL
const url = baseUrl + 'producto/';

export default class Producto extends Component {
    //DATOS 
    state = {}

    //PETICION GET
    peticionGetProducto = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data, loading: false });
        }).catch(error => {
            console.log(error.message);
        })
    }
    //PETICION POST
    peticionPostProducto = async () => {

        await axios.post(url, this.state.producto, autorizacion).then(response => {
            this.modalInsertarProducto();
            this.peticionGetProducto();

        }).catch(error => {
            console.log(error.message);
        })

    }

    //PETICION PUT
    peticionPutProducto = () => {
        axios.put(url + this.state.editProducto.id, this.state.editProducto, autorizacion).then(response => {
            this.modalInsertarProducto();
            this.peticionGetProducto();

            swal("Good job!", "You clicked the button!", "success");
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoProducto = (producto) => {
        axios.put(url + 'estado/' + producto.id, this.state.editProducto, autorizacion).then(response => {
            this.peticionGetProducto();
            swal("Good job!", "You clicked the button!", "success");
        }).catch(error => {
            console.log(error.message);
            swal("ERROR AL ELIMINAR", 'errores', "error");
        })
    }

    // //MODAL DE INSERTAR

    modalInsertarProducto = () => {
        this.setState({ modalInsertarProducto: !this.state.modalInsertarProducto });
    }



    //MODAL DE EDITAR
    modalEditarProducto = () => {
        this.setState({ modalEditarProducto: !this.state.modalEditarProducto });
    }

    //SELECCIONAR producto PARA EDICIÓN
    seleccionarProducto = (producto) => {
        this.setState({
            editProducto: {
                id: producto.id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                categoria: producto.categoria,
                estado: producto.estado
            }
        })
    }

    //INGRESO DE DATOS AL FORM
    handleChangeProducto = async e => {
        e.persist();
        await this.setState({
            producto: {
                ...this.state.producto,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.producto);
    }

    //INGRESO DE DATOS AL EDITFORM
    handleChangeProductoEditProducto = async e => {
        e.persist();
        await this.setState({
            editProducto: {
                ...this.state.editProducto,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.editProducto);
    }

    //FUNCION DE ARRANQUE
    componentDidMount() {
        this.peticionGetProducto();
    };

    //CONSTRUCTOR
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalInsertarProducto: false,
            modalEditarProducto: false,
            producto: {
                nombre: '',
                descripcion: '',
                imagen: '',
                categoria: 0
            },
            editProducto: {
                id: '',
                nombre: '',
                descripcion: '',
                imagen: '',
                categoria: 0,
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
        this.onGlobalFilterChangeProducto = this.onGlobalFilterChangeProducto.bind(this);

    }

    //RENDERIZAR BOTONES
    Botones(producto) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={producto.id} className='btn btn-primary' onClick={() => { this.seleccionarProducto(producto); this.modalEditarProducto() }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() => { }}><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => this.peticionEstadoProducto(producto)}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>;
    }

    //FILTRADO GLOBAL
    onGlobalFilterChangeProducto(e) {
        const value = e.target.value;
        let filters = { ...this.state.filters };
        filters['global'].value = value;
        console.log(value)
        this.setState({ filters, globalFilterValue: value });
    }

    //RENDERIZAR ENCABEZADO DE LA DATATABLE
    renderHeaderProducto() {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0 h5"></h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChangeProducto} placeholder="Buscar" />
                </span>
            </div>
        )
    }

    render() {
        const { editProducto, data } = this.state;
        const header = this.renderHeaderProducto();
        const toggle = () => this.modalInsertarProducto();
        
        const toggle2 = () => this.modalEditarProducto();
        return (
            <div className="datatable-doc-demo">
                <div className="flex justify-content-between align-items-center">
                    <h5 className="m-0 h5">Producto</h5>
                    <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarProducto() }} ><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
                </div>
                <br />
                <div className='card'>
                    <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
                        dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
                        filters={this.state.filters} loading={this.state.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Productos no encontrados..."
                        currentPageReportTemplate="Registro {first} - {last} de {totalRecords} Productos">
                        <Column field="nombre" header="Nombre" />
                        <Column field="descripcion" header="Descripcion" />
                        <Column field="imagen" header="Imagen" />
                        <Column field="categoria" header="Categoria" />
                        <Column field="estado" header="Botones" body={this.Botones} />

                    </DataTable>
                </div>

                {/* MODAL DE REGISTRAR */}
                <Modal isOpen={this.state.modalInsertarProducto} toggle={toggle} size='lg'>
                    <ModalHeader toggle={toggle}>
                        <span>Agregar Producto</span>
                        <button type="button" className="close" onClick={() => this.modalInsertarProducto()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>

                    <ModalBody>

                        <FormGroup>
                            <Row>
                                <Col md={6}>
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input valid type='text' name='contacto' id='contacto' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Nombre del contacto del producto.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Dirección del producto.
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
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Nombre del contacto del producto.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='direccion'>Dirección:</Label>
                                    <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Dirección del producto.
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
                                    <Label htmlFor='contacto'>Contacto:</Label>
                                    <Input invalid type='text' name='contacto' id='contacto' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Nombre del contacto del producto.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostProducto()}>
                            Insertar
                        </button>
                        <button className='btn btn-danger' onClick={() => this.modalInsertarProducto()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
                {/* MODAL DE EDITAR */}
                <Modal isOpen={this.state.modalEditarProducto}>
                    <ModalHeader>
                        <span >Editar producto</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group"><br />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChangeProducto} value={editProducto.nombre || ''} />
                            <div />
                            <label htmlFor='descripcion'>Descripción</label>
                            <input className='form-control' type='text' name='descripcion' id='descripcion' onChange={this.handleChangeEditProducto} value={editProducto.descripcion || ''} />
                            <label htmlFor='imagen'>Imagen</label>
                            <input className='form-control' name='imagen' id='imagen' onChange={this.handleChangeEditProducto} value={editProducto.imagen || ''} />
                            <label htmlFor='categoria'>Categoria</label>
                            <input className='form-control' name='categorian' id='categoria' onChange={this.handleChangeProducto} value={editProducto.categoria || ''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostProducto()}>
                            Insertar
                        </button>

                        <button className='btn btn-danger' onClick={() => this.modalEditarProducto()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }




}



    //-------------------------------- CAtegoria -----------------------------------------//

