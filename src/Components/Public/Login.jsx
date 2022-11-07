import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const url = 'http://localhost:8083/api/Login';



class Login extends Component {

    state = {
        data: [],
        modalInsertar: false,
        form: {
            id: '',
            contacto: '',
            direccion: '',
            email: '',
            nombre: '',
            telefono: '',
            tipoModal: ''
        }
    }


    render() {
        const { form } = this.state;
        return (
            <div class="limiter">
                <div class="container-login100">
                    <div class="wrap-login100">
                        <div class="login100-pic js-tilt" data-tilt>
                            <img src="" alt="IMG" />
                        </div>

                        <form class="login100-form validate-form">
                            <span class="login100-form-title">
                                Member Login
                            </span>

                            <div class="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
                                <input class="input100" type="text" name="email" placeholder="Email" />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa fa-envelope" aria-hidden="true"><FontAwesomeIcon icon={faUser} /></i>
                                    </span>
                            </div>

                            <div class="wrap-input100 validate-input" data-validate="Password is required">
                                <input class="input100" type="password" name="pass" placeholder="Password" />
                                    <span class="focus-input100"></span>
                                    <span class="symbol-input100">
                                        <i class="fa fa-lock" aria-hidden="true"><FontAwesomeIcon icon={faLock} /></i>
                                    </span>
                            </div>

                            <div class="container-login100-form-btn">
                                <button class="login100-form-btn">
                                    Login
                                </button>
                            </div>

                            <div class="text-center p-t-12">
                                <span class="txt1">
                                    Forgot
                                </span>
                                <a class="txt2" href="#">
                                    Username / Password?
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;