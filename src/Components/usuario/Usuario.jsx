import axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


const url = "http://localhost:8083/api/usuario";

class Usuario extends Component {

  state = {
    data: [],
    modalInsertar: false,
    form : {
      id: '',
      apellido: '',
      direccion: '',
      email: '',
      estado: null,
      fecha: '',
      genero: '',
      identificacion: '',
      nombre: '',
      telefono: ''
    }
  }

  modalInsertar = ()=>{
    this.setState({modalInsertar : !this.state.modalInsertar})
  }

  handleChange = async e =>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })
    console.log(this.state.form)
  }
  
  peticionPut = () => {
    axios.put(url + this.state.form.id, this.state.form).then(response => {
        this.modalInsertar();
        this.peticionGet();
    })
}

peticionPost = async () => {

  delete this.state.form.id;
  await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();

  }).catch(error => {
      console.log(error.message);
  })

}

  seleccionarUsuario = (usuario) => {
    this.setState({
        tipoModal: 'actualizar',
        form: {
            id: usuario.id,
            apellido: usuario.apellido,
            direccion: usuario.direccion,
            email: usuario.email,
            estado: usuario.estado,
            fecha: usuario.fecha,
            genero: usuario.genero,
            identificacion: usuario.identificacion,
            nombre: usuario.nombre,
            telefono: usuario.telfono
        }
    })
}

  peticionGet = () => (
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    })

  )

  componentDidMount() {
    this.peticionGet();
  }

  render() {
    const { form } = this.state;
    return (
      <div className="Usuario" >
        <br />
        <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Usuario</button>
        <br />
        <br />
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Apellido</th>
              <th>direccion</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Genero</th>
              <th>Identificacion</th>
              <th>Nombre</th>
              <th>Telefono</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(usuario => {
              return (
                <tr>
                  <td>{usuario.id}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.direccion}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.estado}</td>
                  <td>{usuario.fecha}</td>
                  <td>{usuario.genero}</td>
                  <td>{usuario.identificacion}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.telefono}</td>
                  <td>
                  <button className='btn btn-primary' onClick={() => { this.seleccionarUsuario(usuario); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {" "}
                    <button className='btn btn-danger'>Eliminar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>

          <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">Id</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1}/>
                    <br />
                    <label htmlFor="nombre">Apellido</label>
                    <input className="form-control" type="text" name="apellido" id="apeliido" onChange={this.handleChange} value={form ? form.apellido:''}/>
                    <br />
                    <label htmlFor="nombre">Direccion</label>
                    <input className="form-control" type="text" name="direccion" id="direccion" onChange={this.handleChange} value={form ? form.direccion:''}/>
                    <br />
                    <label htmlFor="nombre">Email</label>
                    <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange} value={form ? form.email:''}/>
                    <br />
                    <label htmlFor="capital_bursatil">Estado</label>
                    <input className="form-control" type="number" name="estado" id="estado" onChange={this.handleChange} value={form ? form.estado:''}/>
                    <br />
                    <label htmlFor="nombre">Fecha</label>
                    <input className="form-control" type="text" name="fecha" id="fecha" onChange={this.handleChange} value={form ? form.fecha:''}/>
                    <br />
                    <label htmlFor="nombre">Genero</label>
                    <input className="form-control" type="text" name="genero" id="genero" onChange={this.handleChange} value={form ? form.genero:''}/>
                    <br />
                    <label htmlFor="nombre">Identificacion</label>
                    <input className="form-control" type="text" name="identificacion" id="identificacion" onChange={this.handleChange} value={form ? form.identificacion:''}/>
                    <br />
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre:''}/>
                    <br />
                    <label htmlFor="nombre">Telefono</label>
                    <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form ? form.telefono:''}/>
                    <br />
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal ==='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
          </Modal>

          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
                ¿Estás seguro que deseas eliminar el tipo?
            </ModalBody>
           
            <ModalFooter>
                        {this.state.tipoModal === 'insertar' ?
                            <button className='btn btn-success' onClick={() => this.peticionPost()}>
                                Insertar
                            </button> : <button className='btn btn-primary' onClick={() => this.peticionPut()}>
                                Actualizar
                            </button>
                        }
                        <button className='btn btn-danger' onClick={() => this.modalInsertar()}>
                            Cancelar
                        </button>
                    </ModalFooter>
          </Modal>

        </table>
      </div>
    );
  }
}

export default Usuario;