import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { getEventDetails } from '../actions/eventReducerActions';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const EventDetails = ({ match }) => {
	const eventEnded = (day, month, year) => {
		const today = new Date();
		const date = new Date(year, month - 1, day + 1);

		return today > date;
	};

	const addToCartHandler = () => {
		console.log('Added to cart');
	};

	const dispatch = useDispatch();
	const eventDetails = useSelector((state) => state.eventDetails);
	const { loading, success, error, event } = eventDetails;

	useEffect(() => {
		dispatch(getEventDetails(match.params.id));
	}, [match]);

	return (
		<div>
			<Container>
				<div style={{ marginBottom: '10px' }}>
					<LinkContainer to='/events'>
						<a>GO BACK</a>
					</LinkContainer>
				</div>
				{loading ? (
					<Loading />
				) : !success ? (
					<ErrorMessage variant='danger'>{error}</ErrorMessage>
				) : (
					<>
						<Row>
							<Col sm={12} md={9}>
								<Image
									src={event.image}
									alt={event.name}
									fluid
									style={{ marginBottom: '10px' }}
								></Image>
							</Col>
							<Col sm={12} md={3}>
								<ListGroup>
									<ListGroup.Item>
										<Row>
											<Col>Event Name:</Col>
											<Col>{event.name}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Virtual:</Col>
											<Col>
												{event.virtual ? 'Yes' : 'No'}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Available Tickets:</Col>
											<Col>
												{eventEnded(
													event.endsOn.day,
													event.endsOn.month,
													event.endsOn.year
												)
													? '0'
													: event.availableTickets}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Ticket Price:</Col>
											<Col>
												{eventEnded(
													event.endsOn.day,
													event.endsOn.month,
													event.endsOn.year
												)
													? '$0.00'
													: `$${event.ticketPrice}`}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>
												<Button
													style={{ width: '100%' }}
													disabled={
														eventEnded(
															event.endsOn.day,
															event.endsOn.month,
															event.endsOn.year
														) ||
														event.availableTickets <=
															0
													}
													onClick={addToCartHandler}
												>
													Buy Ticket
												</Button>
											</Col>
										</Row>
									</ListGroup.Item>
								</ListGroup>
							</Col>
						</Row>
						<br />
						<br />
						<Row>
							<Col sm={12}>
								<ListGroup>
									<ListGroup.Item>
										<Row>
											<Col>Event Author</Col>
											<Col className='text-right'>
												{event.author}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Event Name</Col>
											<Col className='text-right'>
												{event.name}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Event Description</Col>
											<Col className='text-right'>
												{event.description}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Number of Participants</Col>
											<Col className='text-right'>
												{event.joinedUsers.length}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Category</Col>
											<Col className='text-right'>
												{event.category}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Virtual?</Col>
											<Col className='text-right'>
												{event.virtual ? 'Yes' : 'No'}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>
												{eventEnded(
													event.endsOn.day,
													event.endsOn.month,
													event.endsOn.year
												)
													? `Ended on`
													: `Ends on`}
											</Col>
											<Col className='text-right'>
												{eventEnded(
													event.endsOn.day,
													event.endsOn.month,
													event.endsOn.year
												)
													? `${event.endsOn.day} / ${event.endsOn.month} / ${event.endsOn.year}`
													: `${event.endsOn.day} / ${event.endsOn.month} / ${event.endsOn.year}`}
											</Col>
										</Row>
									</ListGroup.Item>
								</ListGroup>
							</Col>
						</Row>

						<br />
						<br />

						{event.comments.length > 0 ? (
							<Row>
								<Col sm={12}>
									<h1
										style={{
											borderBottom:
												'2px solid whitesmoke',
										}}
									>
										User Comments
									</h1>
									<br />
									<ListGroup variant='flush'>
										{event.comments.map((comment) => (
											<ListGroup.Item key={comment._id}>
												<Row>
													<Col sm={1}>
														<Image
															src='/images/avatar.png'
															fluid
															rounded
															width='50%'
														></Image>
													</Col>
													<Col
														sm={10}
														style={{
															marginLeft: '-3%',
														}}
													>
														<p
															style={{
																margin: '0',
																marginTop:
																	'-1%',
																textDecoration:
																	'underline',
															}}
														>
															{comment.user}
														</p>
														<p>{comment.comment}</p>
													</Col>
													<Col className='text-right'>
														{comment.hearts}{' '}
														<i className='fas fa-heart'></i>
													</Col>
												</Row>
											</ListGroup.Item>
										))}
									</ListGroup>
								</Col>
							</Row>
						) : null}
					</>
				)}
			</Container>
		</div>
	);
};

export default EventDetails;
