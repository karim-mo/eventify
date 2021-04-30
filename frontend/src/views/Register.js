import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Jumbotron, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { registerUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';

const Register = ({ location, history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [CC, setCC] = useState('US');
	const [message, setMessage] = useState(null);

	const redirect = location.search ? location.search.split('=')[1] : '/';

	const userInfo = useSelector((state) => state.userInfo);
	const { loading, isLogged, error } = userInfo;

	useEffect(() => {
		if (isLogged) {
			history.push(redirect);
		}
	}, [history, isLogged]);

	useEffect(() => {
		if (message) {
			setTimeout(() => setMessage(null), 3000);
		}
	}, [message]);

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		} else {
			dispatch(registerUser({ name, email, password, country: CC }));
		}
	};

	return (
		<Fade in={true}>
			<Container>
				<Row className='justify-content-md-center'>
					<Col xs={12} md={6}>
						<h1>Sign Up</h1>
						{loading && <Loading />}
						{error && (
							<ErrorMessage variant='danger'>
								{error}
							</ErrorMessage>
						)}
						{message && (
							<ErrorMessage variant='danger'>
								{message}
							</ErrorMessage>
						)}
						<Form onSubmit={submitHandler}>
							<Form.Group controlId='name'>
								<Form.Label>Name</Form.Label>
								<Form.Control
									type='name'
									placeholder='Enter name'
									value={name}
									onChange={(e) => setName(e.target.value)}
								></Form.Control>
							</Form.Group>

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
									onChange={(e) =>
										setPassword(e.target.value)
									}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='confirmPassword'>
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type='password'
									placeholder='Confirm password'
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='country'>
								<Form.Label>Country Code</Form.Label>
								<Form.Control
									as='select'
									value={CC}
									onChange={(e) => setCC(e.target.value)}
								>
									<option>US</option>
									<option>EG</option>
									<option>UK</option>
								</Form.Control>
							</Form.Group>

							<Button type='submit' variant='primary'>
								Register
							</Button>
						</Form>

						<Row className='py-3'>
							<Col>
								Have an Account?{' '}
								<Link
									to={
										redirect
											? `/login?redirect=${redirect}`
											: '/login'
									}
								>
									Login
								</Link>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		</Fade>
	);
};

export default Register;
