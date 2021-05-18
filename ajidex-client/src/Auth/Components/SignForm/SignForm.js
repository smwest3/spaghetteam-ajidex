import React from "react";
import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const SignForm = ({ setField, submitForm, values, fields }) => {
  return (
    <>
      <React.Fragment>
        <Form onSubmit={submitForm}>
          {fields.map((d) => {
            const { key, name } = d;
            return (
              <div key={key}>
                <Form.Label>{name}: </Form.Label>
                <Form.Control
                  value={values[key]}
                  name={key}
                  onChange={setField}
                  type={
                    key === "password" || key === "passwordConf"
                      ? "password"
                      : ""
                  }
                />
              </div>
            );
          })}
          <br />
          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </React.Fragment>
    </>
  );
};

SignForm.propTypes = {
  setField: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  values: PropTypes.shape({
    email: PropTypes.string.isRequired,
    userName: PropTypes.string,
    password: PropTypes.string.isRequired,
    passwordConf: PropTypes.string,
  }),
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default SignForm;

/*<form onSubmit={submitForm}>
          {fields.map((d) => {
            const { key, name } = d;
            return (
              <div key={key}>
                <span>{name}: </span>
                <input
                  value={values[key]}
                  name={key}
                  onChange={setField}
                  type={
                    key === "password" || key === "passwordConf"
                      ? "password"
                      : ""
                  }
                />
              </div>
            );
          })}
          <input type="submit" value="Submit" />
        </form> */
