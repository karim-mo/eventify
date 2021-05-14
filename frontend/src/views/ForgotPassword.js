import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { loginUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';
import { resetPassword_P1 } from '../actions/confirmationReducerActions';

const ForgotPassword = ({ location, history }) => {
	const dispatch = useDispatch();

	const [email, setEmail] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const userResetPassword = useSelector((state) => state.userResetPassword);
	const { loading, success, error } = userResetPassword;

	useEffect(() => {
		if (successMessage) {
			setTimeout(() => setSuccessMessage(''), 5000);
		}
	}, [successMessage]);

	useEffect(() => {
		if (success) {
			setSuccessMessage(
				`Check your email for a password reset link. Make sure to check your spam folder.`
			);
		}
	}, [success]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(resetPassword_P1(email));
		setEmail('');
	};

	return (
		<Fade in={true}>
			<Container>
				<Row className='justify-content-md-center'>
					<Col xs={12} md={6}>
						<h1>Forgot Password</h1>
						{loading && <Loading />}
						{successMessage && <ErrorMessage variant='success'>{successMessage}</ErrorMessage>}
						{error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
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
							<Button style={{ width: '100%' }} type='submit' variant='primary'>
								Send Email
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</Fade>
	);
};

export default ForgotPassword;
