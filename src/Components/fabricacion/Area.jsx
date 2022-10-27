import axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const url = "http://localhost:8083/api/area";

class Area extends Component {

  state = {
    data: [],
    modalInsertar: false,
    form : {
      id: '',
      estado: '',
      fechafinal: '',
      fechainicio: '',
      nombre:'',
      fabricacion_id:''
    }
  }

  modalInsertar = ()=>{
    this.setState({modalInsertar : !this.state.modalInsertar})
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

  seleccionarArea = (Area) => {
    this.setState({
        tipoModal: 'actualizar',
        form: {
            id: Area.id,
            estado: Area.estado,
            fechainicio: Area.fechainicio,
            fechafinal: Area.fechafinal,
            nombre: Area.nombre,
            fabricacion_id: Area.fabricacion_id,
        }
    })
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
      <div className="Area" >
        <br />
        <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Area</button>
        <br />
        <br />
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Estado</th>
              <th>Fecha de inicio</th>
              <th>Fecha final</th>
              <th>Nombre</th>
              <th>Fabricacion_id</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(area => {
              return (
                <tr>
                  <td>{area.id}</td>
                  <td>{area.estado}</td>
                  <td>{area.fechafinal}</td>
                  <td>{area.fechafinal}</td>
                  <td>{area.nombre}</td>
                  <td>{area.fabricacion_id}</td>
                  <td>
                  <button className='btn btn-primary' onClick={() => { this.seleccionarArea(area); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                    <label htmlFor="nombre">Estado</label>
                    <input className="form-control" type="text" name="estado" id="estado" onChange={this.handleChange} value={form ? form.estado:''}/>
                    <br />
                    <label htmlFor="nombre">Fecha Inicial</label>
                    <input className="form-control" type="text" name="fechainicio" id="fechainicio" onChange={this.handleChange} value={form ? form.fechainicio:''}/>
                    <br />
                    <label htmlFor="nombre">Fecha Final</label>
                    <input className="form-control" type="text" name="fechafinal" id="fechafinal" onChange={this.handleChange} value={form ? form.fechafinal:''}/>
                    <label htmlFor="nombre">Nombre</label>
                    <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre:''}/>
                    <br />
                    <label htmlFor="nombre">Fabricacion Id</label>
                    <input className="form-control" type="text" name="fabricacion_id" id="fabricacion_id" onChange={this.handleChange} value={form ? form.fabricacion_id:''}/>
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

export default Area;