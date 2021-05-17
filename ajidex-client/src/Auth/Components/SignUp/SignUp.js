import React, { Component } from 'react';
import Button from "react-bootstrap/Button";
import PropTypes from 'prop-types';
import SignForm from '../SignForm/SignForm';
import api from '../../../APIEndpoints';
import Errors from '../../../Errors/Errors';

/**
 * @class
 * @classdesc SignUp handles the sign up component
 */
class SignUp extends Component {
    static propTypes = {
        setUser: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            userName: "",
            password: "",
            passwordConf: "",
            error: ""
        };

        this.fields = [
            {
                name: "Email",
                key: "email"
            },
            {
                name: "Username",
                key: "userName"
            },
            {
                name: "Password",
                key: "password"
            },
            {
                name: "Password Confirmation",
                key: "passwordConf"
            }];
    }

    /**
     * @description setField will set the field for the provided argument
     */
    setField = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    /**
     * @description setError sets the error message
     */
    setError = (error) => {
        this.setState({ error })
    }

    /**
     * @description submitForm handles the form submission
     */
    submitForm = async (e) => {
        e.preventDefault();
        const { email,
            userName,
            password,
            passwordConf } = this.state;
        const sendData = {
            email,
            userName,
            password,
            passwordConf
        };
        const response = await fetch(api.base + api.handlers.users, {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });
        if (response.status >= 300) {
            const error = await response.text();
            this.setError(error);
            return;
        }
        const authToken = response.headers.get("Authorization")
        localStorage.setItem("Authorization", authToken);
        this.setError("");
        const user = await response.json();
        this.props.setUser(user);
    }

    render() {
        const values = this.state;
        const { error } = this.state;
        return <div className="sign-in-page">
            <div className="logo">
                <img src="images/AjiDexSmall.png" />
            </div>
            <div className="container">
                <h1>Sign <span className="red">Up</span></h1>
            </div>
            <div className="form">
                <Errors error={error} setError={this.setError} />
                <SignForm
                    setField={this.setField}
                    submitForm={this.submitForm}
                    values={values}
                    fields={this.fields} />
                <Button className="btn btn-primary mr-2" href="/signin">ALREADY A USER? SIGN IN</Button>
            </div>
        </div>
    }
}

export default SignUp;