import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Jumbotron, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { loginUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';
import { resetPassword_P2 } from '../actions/confirmationReducerActions';
import Meta from '../components/Meta';

const ResetPassword = ({ match }) => {
	const dispatch = useDispatch();

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const userResetPassword = useSelector((state) => state.userResetPassword);
	const { loading, success, error } = userResetPassword;

	useEffect(() => {
		if (successMessage) {
			setTimeout(() => setSuccessMessage(''), 5000);
		}
	}, [successMessage]);

	useEffect(() => {
		if (errorMessage) {
			setTimeout(() => setErrorMessage(''), 5000);
		}
	}, [errorMessage]);

	useEffect(() => {
		if (success) {
			setSuccessMessage(`Password reset successful, you can use your new password to login`);
		}
	}, [success]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (password === confirmPassword && password && confirmPassword) {
			dispatch(resetPassword_P2({ passResetURL: match.params.id, newPassword: password }));
			setPassword('');
			setConfirmPassword('');
		} else {
			setErrorMessage('Passwords do not match');
		}
	};

	return (
		<>
			<Meta title='Eventify | Reset Your Password' />
			<Fade in={true}>
				<Container>
					<Row className='justify-content-md-center'>
						<Col xs={12} md={6}>
							<h1>Reset Password</h1>
							{loading && <Loading />}
							{successMessage && (
								<ErrorMessage variant='success'>{successMessage}</ErrorMessage>
							)}
							{errorMessage && <ErrorMessage variant='danger'>{errorMessage}</ErrorMessage>}
							{error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
							<Form onSubmit={submitHandler}>
								<Form.Group controlId='password'>
									<Form.Label>Password</Form.Label>
									<Form.Control
										type='password'
										placeholder='Enter password'
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Form.Group controlId='text'>
									<Form.Label>Confirm Password</Form.Label>
									<Form.Control
										type='password'
										placeholder='Confirm password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
									></Form.Control>
								</Form.Group>
								<Button style={{ width: '100%' }} type='submit' variant='primary'>
									Change Password
								</Button>
							</Form>
						</Col>
					</Row>
				</Container>
			</Fade>
		</>
	);
};

export default ResetPassword;
