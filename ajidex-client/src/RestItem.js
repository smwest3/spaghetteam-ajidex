import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';


function RestItem(props) {

  return (
    <Container fluid className="menuitem">
      <Row>
        <Col>
          <h5>{props.Name}</h5>
          <h6>{props.Address}</h6>
          <p>{props.Description}</p>
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

export default RestItem;
