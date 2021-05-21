import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

function MenuItem(props) {
  let tex = props.Textures.map((tex, idx) => (
    <Badge className="menutag" variant="secondary" key={idx}>
      {tex}
    </Badge>
  ));

  let diet = props.Diets.map((d, idx) => (
    <Badge className="menutag" variant="info" key={idx}>
      {d}
    </Badge>
  ));

  return (
    <Container fluid className="menuitem">
      <Row>
        <Col>
          <h5>{props.Name}</h5>
          <h6>{"$" + props.Price}</h6>
          <p>
            {props.Description}
            <br />
            <Badge className="menutag" variant="danger">
              {props.Calories} cal
            </Badge>
            {tex}
            {diet}
          </p>
        </Col>
        <Col xs="auto">
          <Image
            width={128}
            rounded
            fluid
            src={props.Image}
            alt="Generic placeholder"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default MenuItem;
