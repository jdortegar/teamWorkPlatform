import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import { LinkContainer } from 'react-router-bootstrap';

const HeaderNavbar = () => {
	return (
		<Navbar inverse collapseOnSelect>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="index.html"><img className="logo" src='/resources/img/logo.png' />
                    </a>
                    <span className="logo-habla">Habla</span>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <NavItem eventKey={1} href="#/">Product</NavItem>
                    <NavItem eventKey={2} href="#/">Pricing</NavItem>
                    <LinkContainer to="/team">
                        <NavItem eventKey={3} >Your Teams</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                        <NavItem eventKey={4} >Sign Up</NavItem>
                    </LinkContainer>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
	);
}

export default HeaderNavbar;
