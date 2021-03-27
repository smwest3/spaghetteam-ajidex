import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';

//Creates header
export function Header(props) {
  const [query, setQuery] = useState();
  return (
    <div>
    <Navbar className="nav" fixed="top" expand="lg" variant="dark">
      <LinkContainer to="/"><Navbar.Brand>AjiDex</Navbar.Brand></LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
          <LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer>
          <LinkContainer to="/contact"><Nav.Link>Contact</Nav.Link></LinkContainer>
        </Nav>
        <Form action="/restaurants/" method="get" autoComplete="off" inline>
          <FormControl type="text" value={query} onInput={(e) => setQuery(e.target.value)} className="mr-sm-2" id="header-rest-search" name="rest" placeholder="Find a Restaurant"/>
          <Button className="searchbtn" type="submit" variant="outline-light">Search</Button>
        </Form>
        <Nav>
          <NavDropdown alignRight title="Profile" id="basic-nav-dropdown">
            <LinkContainer to="/profile"><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
            <LinkContainer to="/diet"><NavDropdown.Item>My Diet</NavDropdown.Item></LinkContainer>
            <NavDropdown.Divider />
            <LinkContainer to="/settings"><NavDropdown.Item>Settings</NavDropdown.Item></LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
