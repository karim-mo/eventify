import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Jumbotron, Row, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { loginUser } from '../actions/userReducerActions';
import Fade from '@material-ui/core/Fade';
import { resetPassword_P2 } from '../actions/confirmationReducerActions';
import { sendEventTicket } from '../actions/supportReducerActions';

const CreateEventTicket = ({ match }) => {
	const dispatch = useDispatch();

	const [eventDetails, setEventDetails] = useState({ name: '', email: '', description: '' });
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
			setSuccessMessage(`Event request successfully sent, we'll get back to you shortly`);
		}
	}, [success]);

	const submitHandler = (e) => {
		e.preventDefault();
		if (eventDetails.name && eventDetails.email && eventDetails.description) {
			dispatch(sendEventTicket(eventDetails));
			setEventDetails({ name: '', email: '', description: '' });
		} else {
			setErrorMessage('All fields are required');
		}
	};

	return (
		<Fade in={true}>
			<Container>
				<Row className='justify-content-md-center'>
					<Col xs={12} md={6}>
						<h1>New Event Request</h1>
						{loading && <Loading />}
						{successMessage && <ErrorMessage variant='success'>{successMessage}</ErrorMessage>}
						{errorMessage && <ErrorMessage variant='danger'>{errorMessage}</ErrorMessage>}
						{error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
						<ListGroup style={{ backgroundColor: 'white' }} className='mt-3 mb-3'>
							<ListGroup.Item active>
								In your description please include the following:
							</ListGroup.Item>
							<ListGroup.Item>- Event Name</ListGroup.Item>
							<ListGroup.Item>
								- Event Image Link (Has to be informative and appropriate)
							</ListGroup.Item>
							<ListGroup.Item>- Event Detailed Description</ListGroup.Item>
							<ListGroup.Item>- Event Category</ListGroup.Item>
							<ListGroup.Item>- Ticket Price</ListGroup.Item>
							<ListGroup.Item>- Amount of tickets for us to sell</ListGroup.Item>
							<ListGroup.Item>- Countries your event will be hosted in</ListGroup.Item>
							<ListGroup.Item>- Is it a virtual event?</ListGroup.Item>
							<ListGroup.Item>
								- When does the event ticket purchasing end? (This will mostly be a while
								before your event starts)
							</ListGroup.Item>
							<ListGroup.Item>
								Note: You should mention in your description when exactly will the event
								start.
							</ListGroup.Item>
						</ListGroup>
						<Form onSubmit={submitHandler}>
							<Form.Group controlId='name'>
								<Form.Label>Name</Form.Label>
								<Form.Control
									type='text'
									name='name'
									placeholder='Enter your/author name'
									value={eventDetails.name}
									onChange={(e) =>
										setEventDetails({ ...eventDetails, [e.target.name]: e.target.value })
									}
								></Form.Control>
							</Form.Group>
							<Form.Group controlId='email'>
								<Form.Label>Email (Has to be registered on our platform)</Form.Label>
								<Form.Control
									type='email'
									name='email'
									placeholder='Enter your/author email'
									value={eventDetails.email}
									onChange={(e) =>
										setEventDetails({ ...eventDetails, [e.target.name]: e.target.value })
									}
								></Form.Control>
							</Form.Group>
							<Form.Group controlId='description'>
								<Form.Label>Description</Form.Label>
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
									value={eventDetails.description}
									onChange={(e) =>
										setEventDetails({ ...eventDetails, [e.target.name]: e.target.value })
									}
								></textarea>
							</Form.Group>
							<Button style={{ width: '100%' }} type='submit' variant='primary'>
								Submit Request
							</Button>
						</Form>
					</Col>
				</Row>
			</Container>
		</Fade>
	);
};

export default CreateEventTicket;
