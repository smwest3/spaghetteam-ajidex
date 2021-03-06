import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';

//Creates header on main page
export function Header(props) {
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
        <Form inline>
          <FormControl type="text" placeholder="Find a Restaurant" className="mr-sm-2" />
          <Button className="searchbtn" variant="outline-light">Search</Button>
        </Form>
        <Nav>
          <NavDropdown alignRight title="Profile" id="basic-nav-dropdown">
            <LinkContainer to="/profile"><NavDropdown.Item>Profile</NavDropdown.Item></LinkContainer>
            <LinkContainer to="/diet"><NavDropdown.Item>Diet</NavDropdown.Item></LinkContainer>
            <NavDropdown.Divider />
            <LinkContainer to="/settings"><NavDropdown.Item>Settings</NavDropdown.Item></LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
