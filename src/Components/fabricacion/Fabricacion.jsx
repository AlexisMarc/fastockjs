import axios from 'axios';
import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const url = "http://localhost:8083/api/fabricacion";

class Fabricacion extends Component {

  state = {
    data: [],
    modalInsertar: false,
    form : {
      id: '',
      estado: null,
      fechafinal: '',
      fechainicio: ''
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

  seleccionarFabricacion = (fabricacion) => {
    this.setState({
        tipoModal: 'actualizar',
        form: {
            id: fabricacion.id,
            esatdo: fabricacion.estado,
            fechainicio: fabricacion.fechainicio,
            fechafinal: fabricacion.fechafinal,
            identificacion: fabricacion.identificacion
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
      <div className="Fabricacion" >
        <br />
        <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Fabricacion</button>
        <br />
        <br />
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Estado</th>
              <th>Fecha de inicio</th>
              <th>Fecha final</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(fabricacion => {
              return (
                <tr>
                  <td>{fabricacion.id}</td>
                  <td>{fabricacion.estado}</td>
                  <td>{fabricacion.fechafinal}</td>
                  <td>{fabricacion.fechafinal}</td>
                  <td>
                  <button className='btn btn-primary' onClick={() => { this.seleccionarFabricacion(fabricacion); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
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
                    <input className="form-control" type="text" name="fechafinal" id="fechafinal" onChange={this.handleChange} value={form ? form.fechafinal:''} />
                  </div>
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

export default Fabricacion;