import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SignForm from '../SignForm/SignForm';
import api from '../../../APIEndpoints';
import Errors from '../../../Errors/Errors';
import Button from "react-bootstrap/Button";

/**
 * @class
 * @classdesc SignIn handles the sign in component
 */
class SignIn extends Component {
    static propTypes = {
        setAuthToken: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: ""
        };

        this.fields = [
            {
                name: "Email",
                key: "email"
            },
            {
                name: "Password",
                key: "password"
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
        const { email, password } = this.state;
        const sendData = { email, password };
        const response = await fetch(api.base + api.handlers.session, {
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

    setRedirect = () => {
        return
    }

    render() {
        const values = this.state;
        const { error } = this.state;
        return <div className="sign-in-page">
            <div className="logo">
                <img src="images/logo.png" />
            </div>
            <div className="container">
                <h1>Sign <span className="red">In</span></h1>
            </div>
            <div className="form">
                <Errors error={error} setError={this.setError} />
                <SignForm
                    setField={this.setField}
                    submitForm={this.submitForm}
                    values={values}
                    fields={this.fields} />
                    <Button className="btn btn-primary mr-2" href="/signup">NEW? SIGN UP!</Button>
            </div>
        </div>
    }
}

export default SignIn;