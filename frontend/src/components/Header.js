import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const Header = () => {
	return (
		<div className='tophead'>
			<Navbar
				bg='primary'
				variant='dark'
				expand='lg'
				collapseOnSelect
				className='fixed-top'
			>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>Eventify</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav>
							<LinkContainer to='/'>
								<Nav.Link>Home</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/events'>
								<Nav.Link>Events</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/about'>
								<Nav.Link>About</Nav.Link>
							</LinkContainer>
						</Nav>
						<Nav className='ml-auto'>
							<LinkContainer to='/login'>
								<Nav.Link>
									<i className='fas fa-user'></i> Login
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/login'>
								<Nav.Link>
									<i className='fas fa-user-plus'></i> Sign Up
								</Nav.Link>
							</LinkContainer>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};

export default Header;
