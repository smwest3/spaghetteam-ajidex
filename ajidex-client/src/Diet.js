import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import api from "./APIEndpoints";

const testDiet = {
  allergens: ["Pork", "Sugar"],
  textures: null,
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
    let diet = await getMyDiet();
    setMyDiet(diet);
  }, []);

  const [texVal, setTexVal] = useState();
  const onTexInput = ({ target: { value } }) => setTexVal(value);
  const onTexFormSubmit = async (e) => {
    e.preventDefault();
    setMyDiet((await patchDiet(texVal, "Texture", "Add")) || myDiet);
  };

  const [dietVal, setDietVal] = useState();
  const onDietInput = ({ target: { value } }) => setDietVal(value);
  const onDietFormSubmit = async (e) => {
    e.preventDefault();
    setMyDiet((await patchDiet(dietVal, "Diet", "Add")) || myDiet);
  };

  const [alleVal, setAlleVal] = useState();
  const onAlleInput = ({ target: { value } }) => setAlleVal(value);
  const onAlleFormSubmit = async (e) => {
    e.preventDefault();
    setMyDiet((await patchDiet(alleVal, "Allergen", "Add")) || myDiet);
  };

  const del = async (val, type) => {
    setMyDiet((await patchDiet(val, type, "Delete")) || myDiet);
  };

  return (
    <div style={{ marginLeft: "5vw", marginRight: "5vw" }}>
      <h1
        style={{
          fontFamily: "Raleway",
          fontWeight: 900,
          marginTop: "20px",
        }}
      >
        Customize your diet
      </h1>
      {myDiet ? (
        <div>
          <h4>Textures</h4>
          <Form onSubmit={onTexFormSubmit} inline>
            <Form.Control
              type="text"
              className="mr-sm-2"
              placeholder="Exclude a texture"
              value={texVal}
              onChange={onTexInput}
            />
            <Button type="submit">Exclude</Button>
          </Form>
          {myDiet.textures ? (
            myDiet.textures.map((t, i) => {
              return (
                <Badge
                  key={i + " " + t}
                  className="menutag"
                  variant="secondary"
                >
                  {t}{" "}
                  <Badge variant="light" onClick={() => del(t, "Texture")}>
                    x
                  </Badge>
                </Badge>
              );
            })
          ) : (
            <p>Exclude some textures above</p>
          )}
          <br />
          <br />
          <h4>Diets</h4>
          <Form onSubmit={onDietFormSubmit} inline>
            <Form.Control
              type="text"
              className="mr-sm-2"
              placeholder="Add a diet"
              value={dietVal}
              onChange={onDietInput}
            />
            <Button type="submit">Add</Button>
          </Form>
          {myDiet.diets ? (
            myDiet.diets.map((d, i) => {
              return (
                <Badge key={i + " " + d} className="menutag" variant="dark">
                  {d}{" "}
                  <Badge variant="light" onClick={() => del(d, "Diet")}>
                    x
                  </Badge>
                </Badge>
              );
            })
          ) : (
            <p>Add some diets above</p>
          )}
          <br />
          <br />
          <h4>Allergies</h4>
          <Form onSubmit={onAlleFormSubmit} inline>
            <Form.Control
              type="text"
              className="mr-sm-2"
              placeholder="Add an allergen"
              value={alleVal}
              onChange={onAlleInput}
            />
            <Button type="submit">Add</Button>
          </Form>
          {myDiet.allergens ? (
            myDiet.allergens.map((a, i) => {
              return (
                <Badge key={i + " " + a} className="menutag" variant="dark">
                  {a}{" "}
                  <Badge variant="light" onClick={() => del(a, "Allergen")}>
                    x
                  </Badge>
                </Badge>
              );
            })
          ) : (
            <p>Add some allergens above</p>
          )}
        </div>
      ) : (
        <p>Loading diet!</p>
      )}
    </div>
  );
};

const patchDiet = async (val, type, action) => {
  subState.loading = true;
  subState.requestFinished = false;

  const response = await fetch(api.base + api.handlers.mydiet, {
    method: "PATCH",
    headers: new Headers({
      Authorization: localStorage.getItem("Authorization"),
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      RestrictName: val,
      RestrictType: type,
      ActionToDo: action,
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
  return diet;
};

const getMyDiet = async () => {
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
  return diet;
};
