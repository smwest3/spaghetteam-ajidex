import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const Diet = () => {
  return (
    <div>
      <h1>Customize your diet</h1>
      <h4>Textures</h4>
      <Form action="/restaurants/" method="get" autoComplete="off" inline>
        <FormControl
          type="text"
          className="mr-sm-2"
          placeholder="Search textures"
        />
        <Button>Search</Button>
      </Form>
      <Badge className="menutag" variant="secondary">
        Fibrous <Badge variant="light">x</Badge>
      </Badge>
      <Badge className="menutag" variant="secondary">
        Spongy <Badge variant="light">x</Badge>
      </Badge>
      <Badge className="menutag" variant="secondary">
        Mushy <Badge variant="light">x</Badge>
      </Badge>
      <br />
      <br />
      <h4>Diets</h4>
      <Form>
        <Form.Group controlId="diet.Diets">
          <Form.Control as="select" multiple>
            <option>Keto</option>
            <option>Pescatarian</option>
            <option>Vegan</option>
            <option>Vegetarian</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <h4>Allergies</h4>
      <Form action="/restaurants/" method="get" autoComplete="off" inline>
        <FormControl
          type="text"
          className="mr-sm-2"
          placeholder="Search ingredients"
        />
        <Button>Search</Button>
      </Form>
      <Badge className="menutag" variant="dark">
        Gluten <Badge variant="light">x</Badge>
      </Badge>
      <Badge className="menutag" variant="dark">
        Peanuts <Badge variant="light">x</Badge>
      </Badge>
      <br />
      <br />
      <br />
      <Button variant="success" type="submit">
        Submit
      </Button>
    </div>
  );
};
