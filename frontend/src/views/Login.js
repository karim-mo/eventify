import React, { useState, useEffect } from 'react';
import {
	Button,
	Card,
	Col,
	Container,
	Form,
	Jumbotron,
	Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { loginUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';
import { reSendUserConfirmation } from '../actions/confirmationReducerActions';

const Login = ({ location, history }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState(null);
	const [message, setMessage] = useState(null);

	const redirect = location.search ? location.search.split('=')[1] : '/';

	const userInfo = useSelector((state) => state.userInfo);
	const { loading, isLogged, error } = userInfo;

	const dispatch = useDispatch();

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
		if (error && error.startsWith('Email')) {
			setEmailError(true);
			dispatch({
				type: 'USER_CART_RESET',
			});
		}
	}, [dispatch, error]);

	useEffect(() => {
		if (awaitingConfirmation && emailError) {
			setMessage('Email Verification Sent, check your email.');
			dispatch({ type: 'USER_CONFIRMATION_RESET' });
			setEmailError(false);
		}
	}, [dispatch, awaitingConfirmation]);

	useEffect(() => {
		if (message) {
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	}, [message]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(loginUser({ email, password }));
	};

	const reSendConfirmationHandler = () => {
		dispatch(reSendUserConfirmation(email));
	};

	return (
		<Fade in={true}>
			<Container>
				{confirmLoading ? (
					<Loading />
				) : emailError ? (
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
											to='/login'
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
				) : (
					<Row className='justify-content-md-center'>
						<Col xs={12} md={6}>
							{message && (
								<ErrorMessage variant='success'>
									{message}
								</ErrorMessage>
							)}
							<h1>Sign In</h1>
							{loading && <Loading />}
							{error && (
								<ErrorMessage variant='danger'>
									{error}
								</ErrorMessage>
							)}
							<Form onSubmit={submitHandler}>
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
				)}
			</Container>
		</Fade>
	);
};

export default Login;
