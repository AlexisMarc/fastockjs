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


import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

//URL PRINCIPAL
const url = baseUrl + 'usuario/';

export default class Usuario extends Component {

  //DATOS
  state = {}

  //PETICIÓN GET
  peticionGetUsuario = () => {
    axios.get(url, autorizacion).then(response => {
      this.setState({ data: response.data, loading: false });
    }).catch(error => {
      console.log(error.message);
      this.setState({ loading: false });
      swal({ title: "ERROR AL CONSULTAR", text: " ", icon: "error", buttons: false, timer: 1500 })
    })
  }

  //PETICIÓN GET CargoS
  // peticionGetCargo = (id) => {
  //   axios.get(url + 'cargo/' + id, autorizacion).then(response => {
  //     this.setState({ datacargos: response.data });
  //   }).catch(error => {
  //     console.log(error.message);
  //     swal({ title: "ERROR AL CONSULTAR CARGOS", text: " ", icon: "error", buttons: false, timer: 1500 })
  //   })
  // }


  //PETICIÓN POST
  peticionPostUsuario = async () => {

    await axios.post(url, this.state.usuario, autorizacion).then(response => {
      this.modalInsertarUsuario();
      this.peticionGetUsuario();

    }).catch(error => {
      console.log(error.message);
      swal({ title: "ERROR AL REGISTRAR", text: " ", icon: "error", buttons: false, timer: 1500 })
    })

  }

  //PETICIÓN PUT
  peticionPutUsuario = () => {
    axios.put(url + this.state.editUsuario.id, this.state.editUsuario, autorizacion).then(response => {
      this.modalEditarUsuario();
      this.peticionGetUsuario();
      swal({ title: "Usuario " + response.data.nombre + " editado", text: " ", icon: "success", buttons: false, timer: 1500 })
    }).catch(error => {
      console.log(error.message);
      swal({ title: "ERROR AL EDITAR", text: " ", icon: "error", buttons: false, timer: 1500 })
    })
  }

  //PETICIÓN ESTADO

  peticionEstadoUsuario = (usuario) => {
    axios.put(url + 'estado/' + usuario.id, this.state.editUsuario, autorizacion).then(response => {
      this.peticionGetusuario();
      swal({ title: "usuario " + response.data.nombre + " eliminado", text: " ", icon: "success", buttons: false, timer: 1500 })
    }).catch(error => {
      console.log(error.message);
      swal({ title: "ERROR AL ELIMINAR", text: " ", icon: "error", buttons: false, timer: 1500 })
    })
  }

  //MODAL DE INSERTAR
  modalInsertarUsuario = () => {
    this.setState({ modalInsertarUsuario: !this.state.modalInsertarUsuario })
  }

  //MODAL DE VIEW
  modalViewUsuario = () => {
    this.setState({ modalViewUsuario: !this.state.modalViewUsuario });
  }

  //MODAL DE EDITAR
  modalEditarUsuario = () => {
    this.setState({ modalEditarUsuario: !this.state.modalEditarUsuario });
  }
  //SELECCIONAR USUARIO PARA EDICIÓN
  seleccionarUsuario = (usuario) => {
    this.setState({
      editUsuario: {
        tipo: usuario.tipo,
        identificacion: usuario.identificacion,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        genero: usuario.genero,
        fecha: usuario.fecha,
        direccion: usuario.direccion,
        telefono: usuario.telfono,
        email: usuario.email
      }
    })
  }

  //PASAR CARGO
  pasarCargo = (cargo) => {
    this.setState({
      datoscargo: {
        nombre: cargo.nombre
      }
    })
  }
  //INGRESO DE DATOS AL FORM
  handleChangeUsuario = async e => {
    e.persist();
    await this.setState({
      usuario: {
        ...this.state.usuario,
        [e.target.name]: e.target.value
      }
    })
    console.log(this.state.usuario);
  }

  //INGRESO DE DATOS AL editUsuario
  handleChangeEditUsuario = async e => {
    e.persist();
    await this.setState({
      editUsuario: {
        ...this.state.editUsuario,
        [e.target.name]: e.target.value
      }
    })
    console.log(this.state.editUsuario);
  }

  //FUNCION DE ARRANQUE
  componentDidMount() {
    this.peticionGetUsuario();
  }

  //CONSTRUCTOR
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      datacargos: [],
      estadocargos: false,
      modalInsertarUsuario: false,
      modalEditarUsuario: false,
      modalViewUsuario: false,
      cargo: false,
      modelcargo: false,
      datoscargo: {
        nombre: ''
      },
      usuario: {
        tipo: '',
        identificacion: '',
        nombre: '',
        apellido: '',
        genero: '',
        fecha: '',
        direccion: '',
        telefono: '',
        email: '',
        imagen: '',
        cargo: ''
      },
      editUsuario: {
        tipo: '',
        identificacion: '',
        nombre: '',
        apellido: '',
        genero: '',
        fecha: '',
        direccion: '',
        telefono: 0,
        email: '',
        imagen: '',
        cargo: ''
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
  Botones(usuario) {
    return <div className="btn-group btn-group-sm" role="group">
      <button value={usuario.id} className='btn btn-primary' onClick={() => { swal({ title: "¿Desea editar al usuario" + usuario.nombre + "?", icon: "warning", buttons: ["Cancelar", "Editar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.seleccionarUsuario(usuario); this.modalEditarUsuario() } }); }}><FontAwesomeIcon icon={faEdit} /></button>
      <button className='btn btn-info' onClick={() => { this.seleccionarUsuario(usuario); this.modalViewUsuario() }} ><FontAwesomeIcon icon={faEye} /></button>
      <button className='btn btn-danger' onClick={() => { swal({ title: "¿Desea eliminar al usuario " + usuario.nombre + "?", icon: "warning", buttons: ["Cancelar", "Eliminar"], dangerMode: true, }).then((respuesta) => { if (respuesta) { this.peticionEstadoUsuario(usuario) } }); }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
        <span className="p-Input-icon-left">
          <i className="pi pi-search" />
          <InputText value={this.state.globalFilterValue} onChange={this.onGlobalFilterChange} placeholder="Buscar" />
        </span>
      </div>
    )
  }

  render() {
    const { editUsuario, data, datacargos, datoscargo } = this.state;
    const header = this.renderHeader();
    const stiloimg = { "width": "25px", "borderRadius": "20%", "height": "25px" };
    const toggle = () => this.modalInsertarUsuario();
    const toggle2 = () => this.modalEditarUsuario();
    const toggle3 = () => this.modalViewUsuario();
    const cargo = () => this.setState({ cargo: !this.state.cargo });
    const modelcargo = () => this.setState({ modelcargo: !this.state.modelcargo });
   
    return (
      <div className="datatable-doc-demo">
        <div className="flex justify-content-between align-items-center">
          <h5 className="m-0 h5">Usuario</h5>
          <button className='btn btn-primary' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertarUsuario() }}><FontAwesomeIcon icon={faPlus} style={{ "marginRight": "1rem" }} /><span className='menu-title'>Agregar</span></button>
        </div>
        <br />
        <div className='card'>
          <DataTable className='table-hover' value={data} header={header} responsiveLayout="stack"
            dataKey="id" selection={this.state.selectedCustomers} onSelectionChange={e => this.setState({ selectedCustomers: e.value })}
            filters={this.state.filters} loading={this.state.loading}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            breakpoint="800px" paginator rows={10} rowsPerPageOptions={[10, 25, 50]} emptyMessage="Usuarios no encontrados..."
            currentPageReportTemplate="Registro {first} - {last} de {totalRecords} Usuarios">
            <Column field="identificacion" header="Identificacion" />
            <Column field="nombre" header="Nombre" />
            <Column field="telefono" header="Telefono" />
            <Column field="email" header="Email" />
            <Column field="estado" header="Botones" body={this.Botones} />

          </DataTable>
        </div>

        {/* MODAL DE REGISTRAR */}
        <Modal isOpen={this.state.modalInsertarUsuario} toggle={toggle} size="lg">
          <ModalHeader toggle={toggle}>
            <span>Agregar Usuario</span>
            <button type="button" className="close" onClick={() => this.modalInsertarUsuario()}>
              <FontAwesomeIcon icon={faClose} />
            </button>

          </ModalHeader>

          <ModalBody>

            <FormGroup>
              <Row>
                <Col md={6}>
                  <Label htmlFor="tipo">Tipo identificacion</Label>
                  <Input invalid type='text' name='tipo' id='tipo' onChange={this.handleChangetUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
                <Col md={6}>
                  <Label htmlFor="identificacion">Identificacion</Label>
                  <Input invalid type='text' name='identificacion' id='identificacion' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

              </Row>
            </FormGroup>


            <FormGroup>
              <Row>


                <Col md={6}>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input invalid type='text' name='nombre' id='nombre' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input invalid type='text' name='apellido' id='apellido' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>


                <Col md={6}>
                  <Label htmlFor="genero">Genero</Label>
                  <Input invalid type='text' name='genero' id='genero' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input invalid type='text' name='fecha' id='fecha' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>


                <Col md={6}>
                  <Label htmlFor="direccion">Direccion</Label>
                  <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>


                <Col md={6}>
                  <Label htmlFor="email">Email</Label>
                  <Input invalid type='text' name='email' id='email' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="imagen">Imagen</Label>
                  <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeUsuario} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>


          </ModalBody>

          <ModalFooter>
            <button className='btn btn-primary' onClick={() => this.peticionPostUsuario()}>
              Insertar
            </button>
            <button className='btn btn-danger' onClick={() => this.modalInsertarUsuario()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        {/* MODAL DE EDITAR */}
        <Modal isOpen={this.state.modalEditarUsuario} toggle={toggle2} size='lg'>
          <ModalHeader >
            <span>Editar Usuario</span>
            <button type="button" className="close" onClick={() => this.modalEditarUsuario()}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </ModalHeader>
          <ModalBody>

            <FormGroup>
              <Row>
                
                <Col md={6}>
                  <Label htmlFor="tipo">Tipo identificacion</Label>
                  <Input invalid type='text' name='tipo' id='tipo' onChange={this.handleChangeEditUsuario} value={editUsuario.tipo || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="identificacion">Identificacion</Label>
                  <Input invalid type='text' name='identificacion' id='identificacion' onChange={this.handleChangeEditUsuario} value={editUsuario.identificacion || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>


            <FormGroup>
              <Row>
               

                <Col md={6}>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input invalid type='text' name='nombre' id='nombre' onChange={this.handleChangeEditUsuario} value={editUsuario.nombre || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input invalid type='text' name='apellido' id='apellido' onChange={this.handleChangeEditUsuario} value={editUsuario.apellido || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>
                

                <Col md={6}>
                  <Label htmlFor="genero">Genero</Label>
                  <Input invalid type='text' name='genero' id='genero' onChange={this.handleChangeEditUsuario} value={editUsuario.genero || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input invalid type='text' name='fecha' id='fecha' onChange={this.handleChangeEditUsuario} value={editUsuario.fecha || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>
                

                <Col md={6}>
                  <Label htmlFor="direccion">Direccion</Label>
                  <Input invalid type='text' name='direccion' id='direccion' onChange={this.handleChangeEditUsuario} value={editUsuario.direccion || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input invalid type='text' name='telefono' id='telefono' onChange={this.handleChangeEditUsuario} value={editUsuario.telefono || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            <FormGroup>
              <Row>
                

                <Col md={6}>
                  <Label htmlFor="email">Email</Label>
                  <Input invalid type='text' name='email' id='email' onChange={this.handleChangeEditUsuario} value={editUsuario.email || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>

                <Col md={6}>
                  <Label htmlFor="imagen">Imagen</Label>
                  <Input invalid type='text' name='imagen' id='imagen' onChange={this.handleChangeEditUsuario} value={editUsuario.imagen || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>

            

            <FormGroup>
              <Row>
                <Col md={12}>
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input invalid type='text' name='cargo' id='cargo' onChange={this.handleChangeEditUsuario} value={editUsuario.cargo || ''} />
                  <FormFeedback>
                    Complete el campo
                  </FormFeedback>
                </Col>
              </Row>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button className='btn btn-primary' onClick={() => this.peticionPutUsuario()}>
              Actualizar
            </button>
            <button className='btn btn-danger' onClick={() => this.modalEditarUsuario()}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>


        {/* MODAL DE VISTA */}

        <Modal isOpen={this.state.modalViewUsuario} toggle={() => { this.setState({ datacargos: [], cargo: false }); toggle3(); }}>
          <ModalHeader >
            <div><br /><h3>Usuario {editUsuario.nombre}</h3></div>
            <button type="button" className="close" onClick={() => { this.modalViewUsuario(); this.setState({ datacargos: [], cargo: false }) }}>
              <FontAwesomeIcon icon={faClose} />
            </button>
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Row>
                <Col md={12} >
                  <ListGroup flush>
                    <ListGroupItem>
                      <p>Tipo identificación:</p> <h5>{editUsuario.tipo}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Identificación:</p> <h5>{editUsuario.identificacion}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Nombre:</p> <h5>{editUsuario.nombre}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Apellido:</p> <h5>{editUsuario.apellido}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Genero:</p> <h5>{editUsuario.genero}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Fecha:</p> <h5>{editUsuario.fecha}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Dirección:</p><h5>{editUsuario.direccion}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Telefono:</p> <h5>{editUsuario.telefono}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Email:</p> <h5>{editUsuario.email}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Imagen:</p> <h5>{editUsuario.imagen}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <p>Cargo:</p> <h5>{editUsuario.cargo}</h5>
                    </ListGroupItem>
                    <ListGroupItem>
                      <div>
                        <Button color="primary" onClick={() => { this.peticionGetCargo(editUsuario.id); cargo() }} >
                          cargos de {editUsuario.nombre}
                        </Button>

                      </div>
                    </ListGroupItem>

                  </ListGroup>
                </Col>

              </Row>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <button className='btn btn-primary' onClick={() => { this.modalViewUsuario(); this.setState({ datacargos: [], cargo: false }) }}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
      </div >
    );
  }
}
