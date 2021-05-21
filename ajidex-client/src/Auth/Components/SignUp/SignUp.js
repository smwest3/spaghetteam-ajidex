import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import SignForm from "../SignForm/SignForm";
import api from "../../../APIEndpoints";
import Errors from "../../../Errors/Errors";
import logo from "../../../img/AjiDexSmall.png";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect } from "react-router-dom";

/**
 * @class
 * @classdesc SignUp handles the sign up component
 */
class SignUp extends Component {
  static propTypes = {
    setUser: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      userName: "",
      password: "",
      passwordConf: "",
      error: "",
      redir: false,
    };

    this.fields = [
      {
        name: "Email",
        key: "email",
      },
      {
        name: "Username",
        key: "userName",
      },
      {
        name: "Password",
        key: "password",
      },
      {
        name: "Password Confirmation",
        key: "passwordConf",
      },
    ];
  }

  /**
   * @description setField will set the field for the provided argument
   */
  setField = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /**
   * @description setError sets the error message
   */
  setError = (error) => {
    this.setState({ error });
  };

  /**
   * @description submitForm handles the form submission
   */
  submitForm = async (e) => {
    e.preventDefault();
    const { email, userName, password, passwordConf } = this.state;
    const sendData = {
      email,
      userName,
      password,
      passwordConf,
    };
    const response = await fetch(api.base + api.handlers.users, {
      method: "POST",
      body: JSON.stringify(sendData),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    if (response.status >= 300) {
      const error = await response.text();
      this.setError(error);
      return;
    }
    const authToken = response.headers.get("Authorization");
    localStorage.setItem("Authorization", authToken);
    this.setError("");
    const user = await response.json();
    console.log(user);
    this.props.setUser(user);
    this.setState({ redir: true });
  };

  render() {
    const values = this.state;
    const { error } = this.state;
    return (
      <div className="sign-in-page">
        {this.state.redir ? (
          <Redirect to="/diet" />
        ) : (
          <Row>
            <Col>
              <div className="logo d-flex justify-content-center">
                <Image fluid style={{ height: "250px" }} src={logo} />
              </div>
              <div className="container">
                <h1
                  style={{
                    textAlign: "center",
                    fontFamily: "Raleway",
                    fontWeight: "900",
                  }}
                >
                  Sign <span className="red">Up</span>
                </h1>
              </div>
              <div className="form d-flex justify-content-center">
                <Errors error={error} setError={this.setError} />
              </div>
              <div className="form d-flex justify-content-center">
                <SignForm
                  setField={this.setField}
                  submitForm={this.submitForm}
                  values={values}
                  fields={this.fields}
                />
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <Button className="btn btn-secondary mr-2" href="/signin">
                  Already a user? Sign in!
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default SignUp;
