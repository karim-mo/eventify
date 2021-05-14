import React, { useEffect } from 'react';
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTicketDetails } from '../actions/ticketsReducerActions';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import Meta from '../components/Meta';

const Ticket = ({ match }) => {
	const dispatch = useDispatch();

	const ticketDetails = useSelector((state) => state.ticketDetails);
	const { loading, error, ticket, fetched } = ticketDetails;

	useEffect(() => {
		dispatch(getTicketDetails(match.params.id));
	}, [dispatch]);

	return (
		<Container>
			{loading ? (
				<Loading />
			) : error ? (
				<ErrorMessage variant='danger'>{error}</ErrorMessage>
			) : (
				<Row>
					<Meta title={`Eventify | ${ticket.event_name} Ticket`} />
					<Col>
						<Card>
							<Card.Header className='text-center'>
								<h1>{ticket.event_name} Ticket</h1>
							</Card.Header>
							<Card.Body>
								<Row>
									<Col sm={12} md={6}>
										<ListGroup className=' mb-4'>
											<ListGroup.Item className=''>
												<Row>
													<Col xs={5} md={5}>
														Ticket Owner:
													</Col>
													<Col className='text-right'>{ticket.owner}</Col>
												</Row>
											</ListGroup.Item>
											<ListGroup.Item className=''>
												<Row>
													<Col xs={5} md={5}>
														Email:
													</Col>
													<Col className='text-right'>{ticket.owner_email}</Col>
												</Row>
											</ListGroup.Item>
										</ListGroup>

										<ListGroup className=' mb-4'>
											<ListGroup.Item className=''>
												<Row>
													<Col xs={5} md={5}>
														Owner ID:
													</Col>
													<Col className='text-right'>{ticket.owner_id}</Col>
												</Row>
											</ListGroup.Item>
											<ListGroup.Item className=''>
												<Row>
													<Col xs={5} md={5}>
														Ticket ID:
													</Col>
													<Col className='text-right'>{ticket.ticket_id}</Col>
												</Row>
											</ListGroup.Item>
										</ListGroup>
									</Col>
									<Col md={6} className='text-center'>
										<QRCode
											value={`${ticket.URL}`}
											level='H'
											size='300'
											// bgColor='#28a745'
										/>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			)}
		</Container>
	);
};

export default Ticket;
