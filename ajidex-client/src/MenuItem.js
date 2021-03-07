import React from 'react';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Salad from './img/potato_salad_template.jpg';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Media from 'react-bootstrap/Media';
import Image from 'react-bootstrap/Image';


function MenuItem(props) {
  return (
    <Media className="menuitem">
      <Media.Body>
        <h5>Sweet Potato Salad</h5>
        <p>
          A sweet potato salad with only the finest leafy lettuce and thick cut sweet potatoes. Our chef&#39;s finest creation in the world. Honestly idk how he does it.
        <br />
        <Badge variant="secondary">Fibrous</Badge>{' '}
        <Badge variant="secondary">Spongy</Badge>{' '}
        <Badge variant="info">Vegan</Badge>{' '}
        <Badge variant="info">Kosher</Badge>{' '}
        <Badge variant="danger">400 cal</Badge>
        </p>
      </Media.Body>
      <Image
        width={128}
        rounded
        fluid
        src={Salad}
        alt="Generic placeholder"
      />
    </Media>
  );
}

export default MenuItem;
