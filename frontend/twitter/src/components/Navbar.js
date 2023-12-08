import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavigationBar({ isLoggedIn, username, onLogout }) {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="justify-content-between px-3">
            <Navbar.Brand as={Link} to="/">View Tweets</Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="justify-content-center flex-grow-1">
                    {isLoggedIn && (
                    <Nav.Link as={Link} to="/new-tweet">Create Tweet</Nav.Link> 
                    )}
                </Nav>
                <Nav className="justify-content-end">
                    {isLoggedIn ? (
                        <>
                            <Navbar.Text className="me-2">
                                User: {username}
                            </Navbar.Text>
                            <Button variant="outline-info" onClick={onLogout}>Log Out</Button>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavigationBar;
