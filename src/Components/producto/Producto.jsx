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

     //PETICIÓN GET INSUMOS
     peticionGetCategoria = (id) => {
        axios.get(url + 'categoria/' + id, autorizacion).then(response => {
            this.setState({ datacategorias: response.data });
        }).catch(error => {
            console.log(error.message);
            swal({title: "ERROR AL CONSULTAR CATEGORIAS", text: " ",icon: "error",buttons:false, timer:1500})
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

    //MODAL DE VIEW
    modalViewProducto = () => {
        this.setState({ modalViewProducto: !this.state.modalViewProducto });
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

     //PASAR CATEGORIA
     pasarCategoria = (categoria) => {
        this.setState({
            datoscategoria: {
                nombre: categoria.nombre,
                filtro: categoria.filtro
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

    //INGRESO DE DATOS AL editProducto
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
            datacategorias: [],
            estadocategorias: false,
            modalInsertarProducto: false,
            modalEditarProducto: false,
            modalViewProducto: false,
            categoria: false,
            modelcategoria: false,
            datoscategoria: {
                nombre: '',
                filtro:'',
            },
            producto: {
                nombre: '',
                descripcion: '',
                imagen: '',
                categoria: []
            },
            editProducto: {
                id: '',
                nombre: '',
                descripcion: '',
                imagen: '',
                categoria: [],
                estado: '',
                visible:''
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
             <button value={producto.id} className='btn btn-primary' onClick={() => { swal({title: "¿Desea editar al producto "+producto.nombre+"?",icon: "warning",buttons: ["Cancelar", "Editar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.seleccionarProducto(producto); this.modalEditarProducto()}});  }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() => {  this.seleccionarProducto(producto); this.modalViewProducto() }} ><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => {swal({title: "¿Desea eliminar al producto "+producto.nombre+"?",icon: "warning",buttons: ["Cancelar", "Eliminar"],dangerMode:true,}).then((respuesta) => {if(respuesta){this.peticionEstadoProducto(producto)}});}}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
        const { editProducto, data ,datacategorias, datoscategoria } = this.state;
        const header = this.renderHeaderProducto();
        const toggle = () => this.modalInsertarProducto();
        const toggle2 = () => this.modalEditarProducto();
        const toggle3 = () => this.modalViewProducto();
        const categoria = () => this.setState({ categoria: !this.state.categoria });
        const modelcategoria = () => this.setState({ modelcategoria: !this.state.modelcategoria });
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
                <Modal isOpen={this.state.modalEditarProducto} toggle={toggle2} size='lg'>
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

                {/* MODAL DE VISTA */}
                <Modal isOpen={this.state.modalViewProducto} toggle={() => { toggle3(); this.setState({ datacategorias: [], categoria: false }) }}>
                    <ModalHeader >
                        <div><br /><h3>Producto {editProducto.nombre}</h3></div>
                        <button type="button" className="close" onClick={() => this.modalViewProducto()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Row>
                                <Col md={12} >
                                    <ListGroup flush>
                                        <ListGroupItem>
                                            <p>Nombre:</p> <h5>{editProducto.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Descrpción:</p> <h5>{editProducto.descripcion}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Visible:</p> <h5>{editProducto.visible ? "Visible" : "No visible"}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Categoria:</p> <h5>{editProducto.categoria}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Inventario:</p> <h5>{editProducto.inventario}</h5>
                                        </ListGroupItem>
                                        
                                        
                                        

                                        <ListGroupItem>
                                            <div>
                                                <Button color="primary" onClick={() => { this.peticionGetCategoria(editProducto.id); categoria() }} >
                                                    Categoria de {editProducto.nombre}
                                                </Button>

                                            </div>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <Collapse horizontal isOpen={this.state.categoria}>
                                                <ListGroup>
                                                    {datacategorias.length > 0 ?
                                                        datacategorias.map((categoria, index) => {
                                                            return (
                                                                <ListGroupItem action key={index} onClick={() => { modelcategoria(); this.pasarCategoria(categoria) }} style={{ "cursor": "pointer" }}>
                                                                    <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                                                                        {/* {categoria.imagen ?
                                                                            <img src={baseUrl + "files/" + categoria.imagen} style={stiloimg} alt={categoria.id} />
                                                                            : <img src={baseUrl + "files/error.png"} style={stiloimg} alt={categoria.id} />
                                                                        } */}

                                                                        <p>{categoria.nombre}</p>
                                                                    </div>
                                                                </ListGroupItem>
                                                            )
                                                        }) :

                                                        <Alert color="primary">
                                                            No hay insumos registrados con el producto
                                                        </Alert>
                                                    }
                                                </ListGroup>
                                            </Collapse>
                                        </ListGroupItem>
                                    </ListGroup>
                                </Col>

                            </Row>
                            <Modal isOpen={this.state.modelcategoria} toggle={modelcategoria} centered>
                                <ModalHeader toggle={modelcategoria}>
                                    <div><br /><h3>{datoscategoria.nombre}</h3></div>
                                    <button type="button" className="close" onClick={modelcategoria}>
                                        <FontAwesomeIcon icon={faClose} />
                                    </button>
                                </ModalHeader>
                                <ModalBody>
                                    <ListGroup>
                                        <ListGroupItem style={{"display":"flex", "justifyContent": "center"}}>
                                            {datoscategoria.imagen
                                                ? <img src={baseUrl + "files/" + datoscategoria.imagen} style={{"width" : "70%", "borderRadius": "10%"}} alt={datoscategoria.id} />
                                                : <img src={baseUrl + "files/error.png"} style={{"width" : "70%", "borderRadius": "10%"}} alt={datoscategoria.id} />
                                            }

                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Nombre:</p> <h5>{datoscategoria.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Filtro:</p> <h5>{datoscategoria.filtro}</h5>
                                        </ListGroupItem>
                                    </ListGroup>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="secondary" onClick={modelcategoria}>
                                        Cerrar
                                    </Button>
                                </ModalFooter>
                            </Modal>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => { this.modalViewProducto(); this.setState({ datainsumos: [], insumo: false  }) }}>
                            Cerrar
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }




}



    //-------------------------------- CAtegoria -----------------------------------------//

