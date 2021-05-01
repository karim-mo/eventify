import React, { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Jumbotron,
	Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { registerUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';
import {
	sendUserConfirmation,
	reSendUserConfirmation,
} from '../actions/confirmationReducerActions';
import { USER_CONFIRMATION_RESET } from '../types';

const Register = ({ location, history }) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [CC, setCC] = useState('US');
	const [message, setMessage] = useState(null);

	// URL Redirection caching on registration isn't and won't be handled in the scope of this project(Works only in login)
	const redirect = location.search ? location.search.split('=')[1] : '/';

	const userInfo = useSelector((state) => state.userInfo);
	const { loading, isLogged, error } = userInfo;

	const userConfirmation = useSelector((state) => state.userConfirmation);
	const {
		email: confirmEmail,
		awaitingConfirmation,
		loading: confirmLoading,
		reSend,
		error: confirmError,
	} = userConfirmation;

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

	// useEffect(()=>{
	//     if(awaitingConfirmation){
	//         if(reSend){

	//         }
	//     }
	// }, [awaitingConfirmation])

	const dispatch = useDispatch();
	const emailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

	const submitHandler = (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
		} else if (name === '' || email === '' || password === '') {
			setMessage('All fields are required');
		} else if (!emailValid.test(email)) {
			setMessage('Not a valid email address.');
		} else {
			dispatch(
				sendUserConfirmation({ name, email, password, country: CC })
			);
		}
	};

	const reSendConfirmationHandler = () => {
		dispatch(reSendUserConfirmation(email));
	};

	return (
		<Fade in={true}>
			<Container>
				{confirmError && (
					<Row className='justify-content-md-center'>
						<Col xs={12} md={6}>
							<ErrorMessage variant='danger'>
								{confirmError}
							</ErrorMessage>
						</Col>
					</Row>
				)}
				{confirmLoading ? (
					<Loading />
				) : reSend ? (
					<>
						<Row>
							<Col>
								<Card>
									<Card.Header className='text-center'>
										<h2>Confirmation Already Sent!</h2>
									</Card.Header>
									<Card.Body className='text-center'>
										We've previously sent an email to{' '}
										{email} for confirmation, please click
										the link sent to you to finish the
										registration process and be able to use
										Eventify's Services.
										<br />
										<br />
										If you haven't received an email, click{' '}
										<Link
											to='/register'
											onClick={reSendConfirmationHandler}
										>
											Here
										</Link>{' '}
										to send another one!
										<br />
										<br />
										<strong>Note: </strong> Make sure to
										check your spam folder too if you didn't
										receive an email!
										<br />
										<br />
										If any problems occur,{' '}
										<Link to='/contactus'>
											{' '}
											send us an inquiry
										</Link>{' '}
										We'll be happy to assist!
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</>
				) : awaitingConfirmation ? (
					<>
						<Row>
							<Col>
								<Card>
									<Card.Header className='text-center'>
										<h2>Confirmation Sent!</h2>
									</Card.Header>
									<Card.Body className='text-center'>
										We've sent an email to {email} for
										confirmation, please click the link sent
										to you to finish the registration
										process and be able to use Eventify's
										Services.
										<br />
										<br />
										<strong>Note: </strong> Make sure to
										check your spam folder too if you didn't
										receive an email!
										<br />
										<br />
										If any problems occur,{' '}
										<Link to='/contactus'>
											{' '}
											send us an inquiry
										</Link>{' '}
										We'll be happy to assist!
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</>
				) : (
					<>
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
											onChange={(e) =>
												setName(e.target.value)
											}
										></Form.Control>
									</Form.Group>

									<Form.Group controlId='email'>
										<Form.Label>Email Address</Form.Label>
										<Form.Control
											type='email'
											placeholder='Enter email'
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
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
										<Form.Label>
											Confirm Password
										</Form.Label>
										<Form.Control
											type='password'
											placeholder='Confirm password'
											value={confirmPassword}
											onChange={(e) =>
												setConfirmPassword(
													e.target.value
												)
											}
										></Form.Control>
									</Form.Group>

									<Form.Group controlId='country'>
										<Form.Label>Country Code</Form.Label>
										<Form.Control
											as='select'
											value={CC}
											onChange={(e) =>
												setCC(e.target.value)
											}
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
					</>
				)}
			</Container>
		</Fade>
	);
};

export default Register;
