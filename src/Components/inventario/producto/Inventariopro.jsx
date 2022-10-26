import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://localhost:8083/api/inventariopro";

class Inventario extends Component {

    state = {
        data: [],
        modalInsertar: false,
        form: {
            id: '',
            estado: '',
            producto_id: '',
            tipoModal: ''
        }
    }


    peticionGet = () => {
        axios.get(url).then(response => {
            this.setState({ data: response.data });
            console.log(response.data)
        }).catch(error => {
            console.log(error.message);
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

    peticionPut = () => {
        axios.put(url + this.state.form.id, this.state.form).then(response => {
            this.modalInsertar();
            this.peticionGet();
        })
    }

    modalInsertar = () => {
        this.setState({ modalInsertar: !this.state.modalInsertar });
    }

    seleccionarEmpresa = (inventariopro) => {
        this.setState({
            tipoModal: 'actualizar',
            form: {
                id: inventariopro.id,
                estado: inventariopro.estado,
                producto_id: inventariopro.producto_id,
            }
        })
    }

    handleChange = async e => {
        e.persist();
        await this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
        console.log(this.state.form);
    }

    componentDidMount() {
        this.peticionGet();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="App" >
                <br />
                <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Inventario</button>
                <br />
                <br />
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Estado</th>
                            <th>Producto_Id</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map(inventariopro => {
                            return (
                                <tr>
                                    <td>{inventariopro.id}</td>
                                    <td>{inventariopro.estado}</td>
                                    <td>{inventariopro.producto_id}</td>
                                    <td>
                                        <button className='btn btn-primary' onClick={() => { this.seleccionarEmpresa(inventariopro); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                                        {" "}
                                        <button className='btn btn-danger'><FontAwesomeIcon icon={faTrashAlt} /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>


                <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: "block" }}>
                        <span style={{ float: 'righ' }} >x</span>
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="id">ID</label>
                            <input className="form-control" type="number" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : this.state.data.length + 1} />
                            <br />
                            <label htmlFor="estado">Estado</label>
                            <input className="form-control" type="number" name='estado' id='estado' onChange={this.handleChange} value={form ? form.estado : ''} />
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        {this.state.tipoModal == 'insertar' ?
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
            </div>
        );
    }
}

export default Inventario;