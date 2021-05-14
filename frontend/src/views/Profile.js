import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Row, Col, Container, ListGroup, Image, Tabs, Tab } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../actions/orderReducerActions';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Paginate from '../components/Paginate';
import { getUserHostedEvents } from '../actions/eventReducerActions';
import { getUserTickets } from '../actions/ticketsReducerActions';
import Meta from '../components/Meta';

const Profile = ({ match, history }) => {
	const dispatch = useDispatch();
	const [key, setKey] = useState(match.params.key ? match.params.key : 'orders');

	const userOrders = useSelector((state) => state.userOrders);
	const {
		loading: ordersLoading,
		error: ordersError,
		fetched: ordersFetched,
		orders,
		pages: ordersPages,
	} = userOrders;

	const userEvents = useSelector((state) => state.userEvents);
	const {
		loading: eventsLoading,
		error: eventsError,
		fetched: eventsFetched,
		events,
		pages: eventsPages,
	} = userEvents;

	const userTickets = useSelector((state) => state.userTickets);
	const {
		loading: ticketsLoading,
		error: ticketsError,
		fetched: ticketsFetched,
		tickets,
		pages: ticketsPages,
	} = userTickets;

	const userInfo = useSelector((state) => state.userInfo);
	const { user, isLogged } = userInfo;

	const pageNo = match.params.pageNo || 1;

	useEffect(() => {
		if (!isLogged) {
			history.push('/');
		} else {
			switch (key) {
				case 'orders':
					dispatch(getUserOrders(pageNo));
					return;
				case 'tickets':
					dispatch(getUserTickets(pageNo));
					return;
				case 'hosted':
					dispatch(getUserHostedEvents(pageNo));
					return;
				default:
					dispatch(getUserOrders(pageNo));
			}
		}
	}, [dispatch, history, key, pageNo, isLogged]);

	const TabSelectHandler = (k) => {
		setKey(k);
		switch (k) {
			case 'orders':
				history.push(`/members/${user.name}/profile/orders`);
				return;
			case 'tickets':
				history.push(`/members/${user.name}/profile/tickets`);
				return;
			case 'hosted':
				history.push(`/members/${user.name}/profile/hosted`);
				return;
		}
	};

	return (
		<>
			<Meta title='Eventify | Profile' />
			<Container>
				<Row>
					<Col md={4}>
						<h2>User Profile</h2>
						<ListGroup className='mb-4'>
							<ListGroup.Item>
								<Row>
									<Col style={{ textAlign: 'center' }}>
										<Image src='/images/avatar.png' fluid rounded width='50%'></Image>
									</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col sm={2} md={2}>
										Name:
									</Col>
									<Col style={{ textAlign: 'right' }}>{user.name}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col sm={2} md={2}>
										Email:
									</Col>
									<Col style={{ textAlign: 'right' }}>{user.email}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col sm={5} md={5}>
										Country Code:
									</Col>
									<Col style={{ textAlign: 'right' }}>{user.country}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col sm={4} md={4}>
										Joined on:
									</Col>
									<Col style={{ textAlign: 'right' }}>{user.joinedOn.slice(0, 10)}</Col>
								</Row>
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={8}>
						<Tabs activeKey={key} onSelect={(k) => TabSelectHandler(k)}>
							<Tab eventKey='orders' title='Orders'>
								<h2>My Ticket Orders</h2>
								{ordersLoading ? (
									<Loading />
								) : ordersError ? (
									<ErrorMessage variant='info'>{ordersError}</ErrorMessage>
								) : (
									<>
										<Table striped bordered hover responsive className='table-sm'>
											<thead>
												<tr>
													<th>ID</th>
													<th>DATE</th>
													<th>TOTAL PRICE</th>
													<th>STATUS</th>
												</tr>
											</thead>
											<tbody>
												{orders.map((order) => (
													<tr key={order._id}>
														<td>
															<Link to={`/orders/${order._id}`}>
																{order._id}
															</Link>
														</td>
														<td>{order.createdAt.slice(0, 10)}</td>
														<td>${order.totalPrice}</td>
														<td>{order.paymentDetails.status}</td>
													</tr>
												))}
											</tbody>
										</Table>
										<Paginate
											pages={ordersPages}
											page={pageNo}
											profileOrders
											profileName={user.name}
										/>
									</>
								)}
							</Tab>
							<Tab eventKey='tickets' title='Tickets'>
								<h2>My Tickets</h2>
								{ticketsLoading ? (
									<Loading />
								) : ticketsError ? (
									<ErrorMessage variant='info'>{ticketsError}</ErrorMessage>
								) : (
									<>
										<Table striped bordered hover responsive className='table-sm'>
											<thead>
												<tr>
													<th>ID</th>
													<th>PURCHASED ON</th>
													<th>EVENT</th>
												</tr>
											</thead>
											<tbody>
												{tickets.map((ticket) => (
													<tr key={ticket._id}>
														<td>
															<Link to={`/ticket/details/${ticket._id}`}>
																{ticket._id}
															</Link>
														</td>
														<td>{ticket.createdAt.slice(0, 10)}</td>
														<td>
															<Link to={`/event/details/${ticket.eventID}`}>
																{ticket.eventName}
															</Link>
														</td>
													</tr>
												))}
											</tbody>
										</Table>
										<Paginate
											pages={ticketsPages}
											page={pageNo}
											profileTickets
											profileName={user.name}
										/>
									</>
								)}
							</Tab>
							<Tab eventKey='hosted' title='Hosted Events'>
								<h2>My Events</h2>
								{eventsLoading ? (
									<Loading />
								) : eventsError ? (
									<ErrorMessage variant='info'>{eventsError}</ErrorMessage>
								) : (
									<>
										<Table striped bordered hover responsive className='table-sm'>
											<thead>
												<tr>
													<th>ID</th>
													<th>Created On</th>
													<th>Ends On</th>
													<th># of Participants</th>
													<th>Available Tickets</th>
													<th>Virtual</th>
												</tr>
											</thead>
											<tbody>
												{events.map((event) => (
													<tr key={event._id}>
														<td>
															<Link to={`/event/details/${event._id}`}>
																{event._id}
															</Link>
														</td>
														<td>{event.createdAt.slice(0, 10)}</td>
														<td>{`${
															event.endsOn.year
														}-${event.endsOn.month.toLocaleString('en-US', {
															minimumIntegerDigits: 2,
															useGrouping: false,
														})}-${event.endsOn.day.toLocaleString('en-US', {
															minimumIntegerDigits: 2,
															useGrouping: false,
														})}`}</td>
														<td>{event.joinedUsers.length}</td>
														<td>{event.availableTickets}</td>
														<td>{event.virtual ? 'Yes' : 'No'}</td>
													</tr>
												))}
											</tbody>
										</Table>
										<Paginate
											pages={eventsPages}
											page={pageNo}
											profileHostedEvents
											profileName={user.name}
										/>
									</>
								)}
							</Tab>
						</Tabs>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Profile;
