import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { LinkContainer } from 'react-router-bootstrap';


function RestItem(props) {

  return (
    <LinkContainer to={"/restaurants/" + props.Url}>
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
    </LinkContainer>
  );
}

export default RestItem;
