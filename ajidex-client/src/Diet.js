import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import api from "./APIEndpoints";

const testDiet = {
  ingredients: ["Pork", "Sugar"],
  textures: ["Smooth, like jazz"],
  diets: ["Keto"],
};

//state to keep track of restaurants returned
const subState = {
  error: "",
  requestFinished: true,
  loading: false,
};

export const Diet = () => {
  const [myDiet, setMyDiet] = useState();

  useEffect(async () => {
    subState.loading = true;
    subState.requestFinished = false;

    const response = await fetch(api.base + api.handlers.mydiet, {
      method: "GET",
      headers: new Headers({
        Authorization: localStorage.getItem("Authorization"),
        "Content-Type": "application/json",
      }),
    });
    if (response.status >= 300) {
      const error = await response.text();
      console.log(error);
      subState.error = error;
      return;
    }
    if (subState.error.length != 0) {
      subState.error = "";
    }
    const diet = await response.json();
    subState.loading = false;
    subState.requestFinished = true;
    console.log(diet);
    setMyDiet(
      diet.map((d) => ({
        ingredients: d.ingredients,
        textures: d.textures,
        diets: d.diets,
      }))
    );
  }, []);
  return (
    <div>
      <h1>Customize your diet</h1>
      <h4>Textures</h4>
      {myDiet ? (
        <div>
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
      ) : (
        <p>Loading diet!</p>
      )}
    </div>
  );
};
