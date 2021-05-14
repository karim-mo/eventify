import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Jumbotron, Row, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { loginUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';
import { sendSupportTicket } from '../actions/supportReducerActions';

const Support = ({ match }) => {
	const dispatch = useDispatch();

	const [ticketDetails, setTicketDetails] = useState({ name: '', email: '', description: '' });
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const emails = useSelector((state) => state.emails);
	const { loading, success, error } = emails;

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
			setSuccessMessage(`Support ticket created successfully, we'll get back to you shortly`);
		}
	}, [success]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (ticketDetails.name && ticketDetails.email && ticketDetails.description) {
			dispatch(sendSupportTicket(ticketDetails));
			setTicketDetails({ name: '', email: '', description: '' });
		} else {
			setErrorMessage('All fields are required');
		}
	};

	return (
		<Fade in={true}>
			<Container>
				<Row className='justify-content-md-center'>
					<Col xs={12} md={6}>
						<h1>New Support Inquiry</h1>
						{loading && <Loading />}
						{successMessage && <ErrorMessage variant='success'>{successMessage}</ErrorMessage>}
						{errorMessage && <ErrorMessage variant='danger'>{errorMessage}</ErrorMessage>}
						{error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}

						<Form onSubmit={submitHandler}>
							<Form.Group controlId='name'>
								<Form.Label>Name</Form.Label>
								<Form.Control
									type='text'
									name='name'
									placeholder='Enter your name'
									value={ticketDetails.name}
									onChange={(e) =>
										setTicketDetails({
											...ticketDetails,
											[e.target.name]: e.target.value,
										})
									}
								></Form.Control>
							</Form.Group>
							<Form.Group controlId='email'>
								<Form.Label>Email</Form.Label>
								<Form.Control
									type='email'
									name='email'
									placeholder='Enter your email'
									value={ticketDetails.email}
									onChange={(e) =>
										setTicketDetails({
											...ticketDetails,
											[e.target.name]: e.target.value,
										})
									}
								></Form.Control>
							</Form.Group>
							<ListGroup style={{ backgroundColor: 'white' }} className='mt-3 mb-3'>
								<ListGroup.Item>
									Please be descriptive about your issue so we can help you
								</ListGroup.Item>
							</ListGroup>
							<Form.Group controlId='description'>
								<Form.Label>Issue</Form.Label>
								<textarea
									name='description'
									cols='30'
									rows='10'
									style={{
										width: '100%',
										height: '100px',
										resize: 'none',
										border: '2px solid #333',
									}}
									value={ticketDetails.description}
									onChange={(e) =>
										setTicketDetails({
											...ticketDetails,
											[e.target.name]: e.target.value,
										})
									}
								></textarea>
							</Form.Group>
							<Button style={{ width: '100%' }} type='submit' variant='primary'>
								Create Ticket
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</Fade>
	);
};

export default Support;
