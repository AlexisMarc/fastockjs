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
const url = baseUrl + 'insumo/';

export default class Insumo extends Component {
    //DATOS 
    state = {}

    //PETICION GET
    peticionGetInsumo = () => {
        axios.get(url, autorizacion).then(response => {
            this.setState({ data: response.data, loading: false });
        }).catch(error => {
            console.log(error.message);
        })
    }

    //PETICIÓN GET TIPOS
    peticionGetTipo = () => {
        axios.get(url + 'tipo/', autorizacion).then(response => {
            const datos = [];

            response.data.map((Tipo) => {
                const dato = { value: Tipo.id, label: Tipo.nombre }
                datos.push(dato);
            })

            this.setState({ dataTipos: datos });
        }).catch(error => {
            console.log(error.message);
            swal({ title: "ERROR AL CONSULTAR TIPOS", text: " ", icon: "error", buttons: false, timer: 1500 })
        })
    }

    //PETICION POST
    peticionPostInsumo = async () => {
        var img = null;
        if (this.state.files != null) {
            var bodyFormData = new FormData();
            bodyFormData.append('files', this.state.files);
            await axios.post(baseUrl + "files/upload", bodyFormData, autorizacionFiles).then(response => {
                img = response.data.message;
            }).catch(error => {
                console.log(error.message);
            })
        }
        this.state.Insumo.imagen = img;

        await axios.post(url, this.state.Insumo, autorizacion).then(response => {
            this.modalInsertarInsumo();
            this.peticionGetInsumo();

        }).catch(error => {
            console.log(error.message);
        })

    }

    //PETICION POST TIPO
    peticionPostTipo = async () => {

        await axios.post(url + "tipo", this.state.Tipo, autorizacion).then(response => {
            this.modalInsertarTipo();
            this.peticionGetTipo();

        }).catch(error => {
            console.log(error.message);
        })

    }
    //PETICION PUT
    peticionPutInsumo = () => {
        axios.put(url + this.state.editInsumo.id, this.state.editInsumo, autorizacion).then(response => {
            this.modalInsertarInsumo();
            this.peticionGetInsumo();

            swal("Good job!", "You clicked the button!", "success");
        })
    }

    //PETICIÓN ESTADO
    peticionEstadoInsumo = (Insumo) => {
        axios.put(url + 'estado/' + Insumo.id, this.state.editInsumo, autorizacion).then(response => {
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

    //MODAL DE INSERTAR Tipo
    modalInsertarTipo = () => {
        this.setState({ modalInsertarTipo: !this.state.modalInsertarTipo });
    }

    //MODAL DE EDITAR
    modalEditarInsumo = () => {
        this.setState({ modalEditarInsumo: !this.state.modalEditarInsumo });
    }

    //MODAL DE VIEW
    modalViewInsumo = () => {
        this.setState({ modalViewInsumo: !this.state.modalViewInsumo });
    }

    //SELECCIONAR Insumo PARA EDICIÓN
    seleccionarInsumo = (Insumo) => {
        this.setState({
            editInsumo: {
                id: Insumo.id,
                nombre: Insumo.nombre,
                descripcion: Insumo.descripcion,
                inventario: Insumo.inventario,
                imagen: Insumo.imagen,
                Tipo: Insumo.Tipo,
                estado: Insumo.estado

            }
        })
    }

    //PASAR Tipo
    pasarTipo = (Tipo) => {
        this.setState({
            datosTipo: {
                nombre: Tipo.nombre,
                filtro: Tipo.filtro
            }
        })
    }

    //INGRESO DE DATOS AL FORM
    handleChangeInsumo = async e => {
        e.persist();
        await this.setState({
            Insumo: {
                ...this.state.Insumo,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.Insumo);
    }
    //INGRESO DE FILES
    handleChangeFiles = (e) => {
        this.setState({
            files: e.target.files[0],
        })
    }

    //INGRESO DE DATOS DE Tipo AL Insumo
    handleChangeTipo = async (e) => {

        const lista = []
        e.map((e) => { lista.push(e.value) });

        await this.setState({
            Insumo: {
                ...this.state.Insumo,
                Tipo: lista
            }
        });

        console.log(this.state.Insumo);
    }

    //INGRESO DE DATOS DE Tipo 
    handleChangeInsertarTipo = async (e) => {
        e.persist();
        await this.setState({
            Tipo: {
                ...this.state.Tipo,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.Tipo);
    }

    //INGRESO DE DATOS AL EDITInsumo
    handleChangeInsumoEditInsumo = async e => {
        e.persist();
        await this.setState({
            editInsumo: {
                ...this.state.editInsumo,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.editInsumo);
    }

    //FUNCION DE ARRANQUE
    componentDidMount() {
        this.peticionGetInsumo();
        this.peticionGetTipo();
    };

    //CONSTRUCTOR
    constructor(props) {
        super(props);
        this.state = {
            img: baseUrl + "files/error.png",
            profileImg: baseUrl + "files/error.png",
            data: [],
            files: null,
            modalInsertarInsumo: false,
            modalEditarInsumo: false,
            modalInsertarTipo: false,
            modalViewInsumo: false,
            Insumo: {
                nombre: '',
                descripcion: '',
                imagen: null,
                Tipo: []
            },
            editInsumo: {
                id: '',
                nombre: '',
                descripcion: '',
                imagen: null,
                Tipo: [],
                estado: '',
                inventario: null,
                visible: ''
            },
            Tipo: {
                id: '',
                nombre: ''
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
        this.onGlobalFilterChangeInsumo = this.onGlobalFilterChangeInsumo.bind(this);
        this.headerTemplate = this.headerTemplate.bind(this);
        this.itemTemplate = this.itemTemplate.bind(this);
    }




    //RENDERIZAR IMAGEN
    Imagen(Insumo) {
        return <div >
            {Insumo.imagen
                ? <img src={baseUrl + "files/" + Insumo.imagen} style={{ "width": "45px", "borderRadius": "10%" }} alt={Insumo.id} />
                : <img src={baseUrl + "files/error.png"} style={{ "width": "45px", "borderRadius": "10%" }} alt={Insumo.id} />
            }
        </div>;
    }

    //RENDERIZAR INVENTARIO
    Inventario(Insumo) {
        return <div>
            <h5>{!Insumo.inventario ? <Badge color="primary"> Tiene inventario</Badge> : <Badge color="danger">Sin inventario</Badge>}</h5>
        </div>;
    }

    //RENDERIZAR VISIBLE
    Visible(Insumo) {
        return <div >
            <h5>{Insumo.visible ? <Badge color="primary"> Es visible</Badge> : <Badge color="danger">No visible</Badge>}</h5>
        </div>;
    }

    //RENDERIZAR BOTONES
    Botones(Insumo) {
        return <div className="btn-group btn-group-sm" role="group">
            <button value={Insumo.id} className='btn btn-primary' onClick={() => { swal({ title: "¿Desea editar al Insumo " + Insumo.nombre + "?", icon: "warning", buttons: ["Cancelar", "Editar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.seleccionarInsumo(Insumo); this.modalEditarInsumo() } }); }}><FontAwesomeIcon icon={faEdit} /></button>
            <button className='btn btn-info' onClick={() => { this.seleccionarInsumo(Insumo); this.modalViewInsumo() }} ><FontAwesomeIcon icon={faEye} /></button>
            <button className='btn btn-danger' onClick={() => { swal({ title: "¿Desea eliminar al Insumo " + Insumo.nombre + "?", icon: "warning", buttons: ["Cancelar", "Eliminar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.peticionEstadoInsumo(Insumo) } }); }}><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>;
    }

    //FILTRADO GLOBAL
    onGlobalFilterChangeInsumo(e) {
        const value = e.target.value;
        let filters = { ...this.state.filters };
        filters['global'].value = value;
        console.log(value)
        this.setState({ filters, globalFilterValue: value });
    }

    //RENDERIZAR ENCABEZADO DE LA DATATABLE
    renderHeaderInsumo() {
        return (
            <div className="flex justify-content-between align-items-center">
                <h5 className="m-0 h5"></h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChangeInsumo} placeholder="Buscar" />
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
    //ARCHIVO
    imageHandler = (e) => {
        this.handleChangeFiles(e);
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                this.setState({ profileImg: reader.result })
            }
        }
        reader.readAsDataURL(e.target.files[0])
    };

    render() {
        const { editInsumo, data, dataTipos, profileImg } = this.state;
        const header = this.renderHeaderInsumo();
        const toggle = () => this.modalInsertarInsumo();
        const toggle2 = () => this.modalEditarInsumo();
        const toggle3 = () => this.modalViewInsumo();
        const toggle4 = () => this.modalInsertarTipo();
        const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'btn-primary' };
        const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
        const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'btn-danger' };

        return (
            <div className="datatable-doc-demo">
                <div className="flex justify-content-between align-items-center">
                    <h5 className="m-0 h5">Insumo</h5>
                    <button className='btn btn-primary' onClick={() => { this.setState({ Insumo: {}, files: null , profileImg: this.state.img }); this.modalInsertarInsumo() }} ><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
                </div>
                <br />
                <div className='card'>
                    <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
                        dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
                        filters={this.state.filters} loading={this.state.loading}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Insumos no encontrados..."
                        currentPageReportTemplate="Registro {first} - {last} de {totalRecords} Insumos">
                        <Column header="Imagen" body={this.Imagen} />
                        <Column field="nombre" header="Nombre" />
                        <Column header="Inventario" body={this.Inventario} />
                        <Column header="Visible" body={this.Visible} />
                        <Column header="Botones" body={this.Botones} />

                    </DataTable>
                </div>

                {/* MODAL DE REGISTRAR */}
                <Modal isOpen={this.state.modalInsertarInsumo} toggle={() => { toggle(); this.setState({ profileImg: this.state.img }) }} size="lg" >
                    <ModalHeader>
                        <span>Agregar Insumo</span>
                        <button type="button" className="close" onClick={() => { this.setState({ profileImg: this.state.img }); this.modalInsertarInsumo(); }}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>

                    </ModalHeader>

                    <ModalBody>

                        <FormGroup>
                            <Row>
                                <Col md={6}>
                                    <Label htmlFor='imagen'>Imagen:</Label>
                                    <div className="custom-file">
                                        <input className='custom-file-input' type="file" name="files" accept="image/*" onChange={this.imageHandler} />
                                        <label data-browse="Seleccionar" className="custom-file-label" htmlFor="customFile">Seleccionar imagen...</label>
                                    </div>
                                    <img src={profileImg} alt="cargado" style={{ "width": "100%", "borderRadius": "0px 0px 10px 10px", "padding": "20px 20px 0px 20px" }} />
                                </Col>
                                <Col md={6}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input invalid type='text' name='nombre' id='nombre' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                        Nombre del Insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                    <Label htmlFor='descripcion'>Descripción:</Label>
                                    <Input type='textarea' name='descripcion' id='descripcion' onChange={this.handleChangeInsumo} />
                                    <FormText>
                                        Descripción del Insumo.
                                    </FormText>
                                    <Label htmlFor='Tipo'>Tipo:</Label>
                                    <br />
                                    <Select options={dataTipos} isMulti name='Tipo' onChange={this.handleChangeTipo} placeholder="Seleccione la Tipo" />
                                    <FormText>
                                        Tipo del Insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete inventarioel campo
                                    </FormFeedback>
                                    <br />
                                    <button className='btn btn-primary' onClick={() => { this.setState({ Tipo: null }); this.modalInsertarTipo() }}>
                                        Agregar Tipo
                                    </button>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostInsumo()}>
                            Insertar
                        </button>
                        <button className='btn btn-danger' onClick={() => { this.setState({ profileImg: this.state.img }); this.modalInsertarInsumo(); }}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>

                {/* MODAL DE EDITAR */}
                <Modal isOpen={this.state.modalEditarInsumo} toggle={toggle2} size='lg'>
                    <ModalHeader>
                        <span >Editar Insumo</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group"><br />
                            <label htmlFor="nombre">Nombre</label>
                            <input className="form-control" type="text" name='nombre' id='nombre' onChange={this.handleChangeInsumo} value={editInsumo.nombre || ''} />
                            <div />
                            <label htmlFor='descripcion'>Descripción</label>
                            <input className='form-control' type='text' name='descripcion' id='descripcion' onChange={this.handleChangeEditInsumo} value={editInsumo.descripcion || ''} />
                            <label htmlFor='imagen'>Imagen</label>
                            <input className='form-control' name='imagen' id='imagen' onChange={this.handleChangeEditInsumo} value={editInsumo.imagen || ''} />
                            <label htmlFor='Tipo'>Tipo</label>
                            <input className='form-control' name='Tipon' id='Tipo' onChange={this.handleChangeInsumo} value={editInsumo.Tipo || ''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostInsumo()}>
                            Insertar
                        </button>

                        <button className='btn btn-danger' onClick={() => this.modalEditarInsumo()}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>

                {/* MODAL DE VISTA */}
                <Modal isOpen={this.state.modalViewInsumo} toggle={toggle3}>
                    <ModalHeader >
                        <div><br /><h3>Insumo {editInsumo.nombre}</h3></div>
                        <button type="button" className="close" onClick={() => this.modalViewInsumo()}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Row>
                                <Col md={12} >
                                    <ListGroup flush>
                                        <ListGroupItem style={{ "display": "flex", "justifyContent": "center" }}>
                                            {editInsumo.imagen
                                                ? <img src={baseUrl + "files/" + editInsumo.imagen} style={{ "width": "70%", "borderRadius": "10%" }} alt={editInsumo.id} />
                                                : <img src={baseUrl + "files/error.png"} style={{ "width": "70%", "borderRadius": "10%" }} alt={editInsumo.id} />
                                            }

                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Nombre:</p> <h5>{editInsumo.nombre}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Descripción:</p> <h5>{editInsumo.descripcion ? editInsumo.descripcion : <Badge color="secondary">Sin Descripción</Badge>}</h5>
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Inventario:</p> {!editInsumo.inventario ? <Badge color="primary"> Tiene inventario</Badge> : <Badge color="danger">Sin inventario</Badge>}
                                        </ListGroupItem>
                                        <ListGroupItem>
                                            <p>Visible:</p> {editInsumo.visible ? <Badge color="primary"> Es visible</Badge> : <Badge color="danger">No visible</Badge>}
                                        </ListGroupItem>

                                        <ListGroupItem>
                                            <p>Tipo:</p>
                                            <ListGroup>
                                                {editInsumo.Tipo.length > 0 ?
                                                    editInsumo.Tipo.map((Tipo, index) => {
                                                        return (
                                                            <ListGroupItem key={index}>
                                                                <p >{Tipo}</p>
                                                            </ListGroupItem>
                                                        )
                                                    }) :

                                                    <Alert color="primary">
                                                        No hay Tipos registradas con el Insumo
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
                        <button className='btn btn-primary' onClick={() => { this.modalViewInsumo(); }}>
                            Cerrar
                        </button>
                    </ModalFooter>
                </Modal>

                {/* MODAL DE Tipo */}
                <Modal isOpen={this.state.modalInsertarTipo} toggle={toggle4} size="sm" >
                    <ModalHeader>
                        <span>Agregar Tipo</span>
                        <button type="button" className="close" onClick={() => { this.modalInsertarTipo(); }}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Row>
                                <Col md={12}>
                                    <Label htmlFor='nombre'>Nombre:</Label>
                                    <Input invalid type='text' name='nombre' id='nombre' onChange={this.handleChangeInsertarTipo} />
                                    <FormText>
                                        Nombre del Insumo.
                                    </FormText>
                                    <FormFeedback>
                                        Complete el campo
                                    </FormFeedback>
                                </Col>
                            </Row>
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <button className='btn btn-primary' onClick={() => this.peticionPostTipo()}>
                            Insertar
                        </button>
                        <button className='btn btn-danger' onClick={() => { this.modalInsertarTipo(); }}>
                            Cancelar
                        </button>
                    </ModalFooter>
                </Modal>
            </div >
        );
    }




}



    //-------------------------------- Tipo -----------------------------------------//

