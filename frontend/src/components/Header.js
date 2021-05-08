import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../actions/userReducerActions';

const Header = () => {
	const dispatch = useDispatch();

	const userInfo = useSelector((state) => state.userInfo);
	const { user } = userInfo;

	const logoutHandler = () => {
		dispatch(logoutUser());
	};

	// useEffect(() => {}, [user]);
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
							{user ? (
								<NavDropdown title={user.name} id='username'>
									<LinkContainer
										to={`/members/${user.name}/profile`}
									>
										<NavDropdown.Item>
											Profile
										</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/cart'>
										<NavDropdown.Item>
											{`Cart(${user.cart.length})`}
										</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<>
									<LinkContainer to='/login'>
										<Nav.Link>
											<i className='fas fa-user'></i>{' '}
											Login
										</Nav.Link>
									</LinkContainer>
									<LinkContainer to='/register'>
										<Nav.Link>
											<i className='fas fa-user-plus'></i>{' '}
											Sign Up
										</Nav.Link>
									</LinkContainer>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
};

export default Header;
