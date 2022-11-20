import React, { Component, } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { FilterMatchMode } from 'primereact/api';
import axios from 'axios';
import { MultiSelect } from 'primereact/multiselect';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faEdit, faEye, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Alert, Badge, Button, Col, Collapse, Dropdown, FormFeedback, FormGroup, FormText, Input, Label, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { autorizacion, baseUrl, autorizacionFiles } from '../../Utils/Api';
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



    //PETICIÓN GET CATEGORIA
    peticionGetCategoria = () => {
        axios.get(url + 'categoria/', autorizacion).then(response => {
            const datos = [];

            response.data.map((categoria) => {
                const dato = { value: categoria.id, label: categoria.nombre }
                datos.push(dato);
            })

            this.setState({ datacategorias: datos });
        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL CONSULTAR CATEGORIAS", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }
    //PETICION POST
    peticionPostProducto = async () => {
        var imagen = null
        if (this.state.files != null) {
            var bodyFormData = new FormData();
            bodyFormData.append('files', this.state.files);
            await axios.post(baseUrl + "files/upload", bodyFormData, autorizacionFiles).then(response => {
                console.log("Subio el archivo")
                imagen = response.data.message
                console.log(imagen);

            }).catch(error => {
                console.log(error.message);
            })
        }

        this.state.producto.imagen = imagen;

        console.log(this.state.producto);

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

    //MODAL DE INSERTAR

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
                inventario: producto.inventario,
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
    //INGRESO DE FILES
    handleChangeFiles = (e) => {
        this.setState({
            files: e.target.files[0],
        })
    }

    //INGRESO DE DATOS AL FORM
    handleChangeCategoria = (e) => {
        const lista = []
        e.map((e) => { lista.push(e.value) });

        this.state.producto.categoria = lista;

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
        this.peticionGetCategoria();
    };

    //CONSTRUCTOR
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            files: null,
            modalInsertarProducto: false,
            modalEditarProducto: false,
            modalViewProducto: false,
            datacategorias: [],
            producto: {
                nombre: '',
                descripcion: '',
                imagen: null,
                categoria: []
            },
            editProducto: {
                id: '',
                nombre: '',
                descripcion: '',
                imagen: null,
                categoria: [],
                estado: '',
                inventario: null,
                visible: ''
            },
            customers: null,
            selectedCustomers: null,
            filters: {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
            },
            globalFilterValue: '',
            loading: true
        }
        this.cities = [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
        ];
        this.Botones = this.Botones.bind(this);
        this.onGlobalFilterChangeProducto = this.onGlobalFilterChangeProducto.bind(this);
        this.headerTemplate = this.headerTemplate.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
    }




    //RENDERIZAR IMAGEN
    Imagen(producto) {
        return <div >
            {producto.imagen
                ? <img src={baseUrl + "files/" + producto.imagen} style={{ "width": "45px", "borderRadius": "10%" }} alt={producto.id} />
                : <img src={baseUrl + "files/error.png"} style={{ "width": "45px", "borderRadius": "10%" }} alt={producto.id} />
            }
        </div>;
    }

    //RENDERIZAR INVENTARIO
    Inventario(producto) {
        return <div>
            <h5>{!producto.inventario ? <Badge color="primary"> Tiene inventario</Badge> : <Badge color="danger">Sin inventario</Badge>}</h5>
        </div>;
    }

    //RENDERIZAR VISIBLE
    Visible(producto) {
        return <div >
            <h5>{producto.visible ? <Badge color="primary"> Es visible</Badge> : <Badge color="danger">No visible</Badge>}</h5>
        </div>;
    }

    //RENDERIZAR BOTONES
    Botones(producto) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={producto.id} className='btn btn-primary' onClick={() => { swal({ title: "¿Desea editar al producto " + producto.nombre + "?", icon: "warning", buttons: ["Cancelar", "Editar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.seleccionarProducto(producto); this.modalEditarProducto() } }); }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() => { this.seleccionarProducto(producto); this.modalViewProducto() }} ><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => { swal({ title: "¿Desea eliminar al producto " + producto.nombre + "?", icon: "warning", buttons: ["Cancelar", "Eliminar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.peticionEstadoProducto(producto) } }); }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
    //EVENTOS DE SUBIR ARCHIVO
    headerTemplate(options) {
        const { className, chooseButton, cancelButton, uploadButton } = options;

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
            </div>
        );
    }
    itemTemplate(file, props) {
        return (
            <div style={{ width: '100%' }}>
                <img alt={file.name} src={file.objectURL} width={"100%"} />
            </div>
        )
    }

    render() {
        const { editProducto, data, datacategorias } = this.state;
        const header = this.renderHeaderProducto();
        const toggle = () => this.modalInsertarProducto();
        const toggle2 = () => this.modalEditarProducto();
        const toggle3 = () => this.modalViewProducto();
        const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'btn-primary' };
        const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
        const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'btn-danger' };

        return (
            <div className="datatable-doc-demo">
                <div className="flex justify-content-between align-items-center">
                    <h5 className="m-0 h5">Producto</h5>
                    <button className='btn btn-primary' onClick={() => { this.setState({ producto: null, files: null }); this.modalInsertarProducto() }} ><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
                </div>
                <br />
                <div className='card'>
                    <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
                        dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
                        filters={this.state.filters} loading={this.state.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Productos no encontrados..."
                        currentPageReportTemplate="Registro {first} - {last} de {totalRecords} Productos">
                        <Column header="Imagen" body={this.Imagen} />
                        <Column field="nombre" header="Nombre" />
                        <Column header="Inventario" body={this.Inventario} />
                        <Column header="Visible" body={this.Visible} />
                        <Column header="Botones" body={this.Botones} />

                    </DataTable>
                </div>

                {/* MODAL DE REGISTRAR */}
                <Modal isOpen={this.state.modalInsertarProducto} toggle={toggle} >
                    <ModalHeader toggle={toggle}>
                        <span>Agregar Producto</span>
                        <button type="button" className="close" onClick={() => this.modalInsertarProducto()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>

                    <ModalBody>

                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input valid type='text' name='nombre' id='nombre' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Nombre del producto.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                                <Col md={12}>
                                    <Label htmlFor='descripcion'>Descripción:</Label>
                                    <Input invalid type='text' name='descripcion' id='descripcion' onChange={this.handleChangeProducto} />
                                    <FormText>
                                        Descripción del producto.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>

                                <Col md={12}>
                                    <Label htmlFor='categoria'>Categoria:</Label>
                                    <br />
                                    <Select options={datacategorias} isMulti name='categoria' onChange={this.handleChangeCategoria} placeholder="Seleccione la categoria" />
                                    <FormText>
                                        Categoria del producto.
                                    </FormText>
                                    <FormFeedback>
                                        Complete inventarioel campo
                                    </FormFeedback>
                                </Col>
                                <Col md={12}>
                                    <br></br>
                                    <Label htmlFor='imagen'>Imagen:</Label>
                                    <input type="file" name="files" onChange={this.handleChangeFiles} />
                                   

                                   
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
                <Modal isOpen={this.state.modalViewProducto} toggle={toggle3}>
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
                                    <ListGroupItem style={{"display":"flex", "justifyContent": "center"}}>
                                            {editProducto.imagen
                                                ? <img src={baseUrl + "files/" + editProducto.imagen} style={{"width" : "70%", "borderRadius": "10%"}} alt={editProducto.id} />
                                                : <img src={baseUrl + "files/error.png"} style={{"width" : "70%", "borderRadius": "10%"}} alt={editProducto.id} />
                                            }

                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Nombre:</p> <h5>{editProducto.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Descripción:</p> <h5>{editProducto.descripcion ? editProducto.descripcion : <Badge color="secondary">Sin Descripción</Badge>}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Inventario:</p> {!editProducto.inventario ? <Badge color="primary"> Tiene inventario</Badge> : <Badge color="danger">Sin inventario</Badge>}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Visible:</p> {editProducto.visible ? <Badge color="primary"> Es visible</Badge> : <Badge color="danger">No visible</Badge>}
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <p>Categoria:</p>
                                            <ListGroup>
                                                {editProducto.categoria.length > 0 ?
                                                    editProducto.categoria.map((categoria, index) => {
                                                        return (
                                                            <ListGroupItem key={index}>
                                                                <p >{categoria}</p>
                                                            </ListGroupItem>
                                                        )
                                                    }) :

                                                    <Alert color="primary">
                                                        No hay categorias registradas con el producto
                                                    </Alert>
                                                }
                                            </ListGroup>
                                        </ListGroupItem>


                                    </ListGroup>
                                </Col>

                            </Row>

                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => { this.modalViewProducto(); this.setState({ datainsumos: [], insumo: false }) }}>
                            Cerrar
                        </button>
                    </ModalFooter>
                </Modal>
            </div >
        );
    }




}



    //-------------------------------- CAtegoria -----------------------------------------//

