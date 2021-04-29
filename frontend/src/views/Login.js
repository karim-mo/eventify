import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Form, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { loginUser } from '../actions/userReducerActions';

const Login = ({ location, history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const redirect = location.search ? location.search.split('=')[1] : '/';

	const userInfo = useSelector((state) => state.userInfo);
	const { loading, success, user, error } = userInfo;

	useEffect(() => {
		if (user) {
			history.push(redirect);
		}
	}, [history, user]);

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(loginUser({ email, password }));
	};

	return (
		<Container>
			<Row className='justify-content-md-center'>
				<Col xs={12} md={6}>
					<h1>Sign In</h1>
					{loading && <Loading />}
					{error && (
						<ErrorMessage variant='danger'>{error}</ErrorMessage>
					)}
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Enter email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Form.Group controlId='password'>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Enter password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></Form.Control>
						</Form.Group>

						<Button type='submit' variant='primary'>
							Sign In
						</Button>
					</Form>

					<Row className='py-3'>
						<Col>
							New User?{' '}
							<Link
								to={
									redirect
										? `/register?redirect=${redirect}`
										: '/register'
								}
							>
								Register
							</Link>
						</Col>
					</Row>
				</Col>
			</Row>
		</Container>
	);
};

export default Login;
