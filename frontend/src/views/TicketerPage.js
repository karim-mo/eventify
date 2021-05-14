import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getPublicTicketDetails, markTicketAsSeen } from '../actions/ticketsReducerActions';
import Meta from '../components/Meta';

const TicketerPage = ({ match }) => {
	const dispatch = useDispatch();

	const publicTicketDetails = useSelector((state) => state.publicTicketDetails);
	const { loading, error, fetched, ticket } = publicTicketDetails;

	useEffect(() => {
		dispatch(getPublicTicketDetails(match.params.id));
	}, [dispatch]);

	const markTicketHandler = (e) => {
		e.preventDefault();
		dispatch(markTicketAsSeen(match.params.id));
	};

	return (
		<>
			<Meta title='Eventify | Verify Ticket' />
			<Container>
				{loading ? (
					<Loading />
				) : error ? (
					<ErrorMessage variant='danger'>{error}</ErrorMessage>
				) : (
					<Row className='justify-content-md-center'>
						<Col xs={12} md={6}>
							<h1>Check Ticket Details</h1>
							<Form onSubmit={(e) => markTicketHandler(e)}>
								<Form.Group controlId='name'>
									<Form.Label>Owner Name</Form.Label>
									<Form.Control type='text' value={ticket.owner} disabled></Form.Control>
								</Form.Group>
								<Form.Group controlId='email'>
									<Form.Label>Owner Email</Form.Label>
									<Form.Control
										type='text'
										value={ticket.owner_email}
										disabled
									></Form.Control>
								</Form.Group>
								<Form.Group controlId='id'>
									<Form.Label>Owner ID</Form.Label>
									<Form.Control type='text' value={ticket.owner_id} disabled></Form.Control>
								</Form.Group>
								<Form.Group controlId='tID'>
									<Form.Label>Ticket ID</Form.Label>
									<Form.Control
										type='text'
										value={ticket.ticket_id}
										disabled
									></Form.Control>
								</Form.Group>
								<Form.Group controlId='eName'>
									<Form.Label>Event Name</Form.Label>
									<Form.Control
										type='text'
										value={ticket.event_name}
										disabled
									></Form.Control>
								</Form.Group>
								<Form.Group controlId='eID'>
									<Form.Label>Event ID</Form.Label>
									<Form.Control type='text' value={ticket.event_id} disabled></Form.Control>
								</Form.Group>
								<Form.Group controlId='seen' className='text-center'>
									<div className='custom-control custom-checkbox'>
										<input
											type='checkbox'
											className='custom-control-input'
											id='seenCheck'
											checked={ticket.seen}
											disabled
										/>
										<label className='custom-control-label' for='seenCheck'>
											Seen?
										</label>
									</div>
								</Form.Group>
								{!ticket.seen && (
									<Button type='submit' variant='primary' style={{ width: '100%' }}>
										Mark Ticket As Seen
									</Button>
								)}
							</Form>
						</Col>
					</Row>
				)}
			</Container>
		</>
	);
};
export default TicketerPage;
