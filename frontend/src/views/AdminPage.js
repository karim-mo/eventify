import React, { useState, useEffect } from 'react';
import {
	Table,
	Form,
	Button,
	Row,
	Col,
	Container,
	ListGroup,
	Image,
	Tabs,
	Tab,
	Modal,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelOrder, getAdminOrders } from '../actions/orderReducerActions';
import AdminPaginate from '../components/AdminPaginate';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { deleteEvent, listEvents } from '../actions/eventReducerActions';
import axios from 'axios';
import { createTicketer, deleteUser, getAdminUsers } from '../actions/userReducerActions';
import { deleteTicket, getAdminTickets } from '../actions/ticketsReducerActions';
import { createPromo, deletePromo, getAdminPromos } from '../actions/promosReducerActions';
import Meta from '../components/Meta';

const AdminPage = ({ match, history }) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [deleteEventModal, setDeleteEventModal] = useState(false);
	const [eventIDToDelete, setEventIDToDelete] = useState(null);
	const [deleteUserModal, setDeleteUserModal] = useState(false);
	const [userIDToDelete, setUserIDToDelete] = useState(null);
	const [ticketerEvent, setTicketerEvent] = useState('');
	const [deleteTicketModal, setDeleteTicketModal] = useState(false);
	const [ticketIDToDelete, setTicketIDToDelete] = useState(null);
	const [deletePromoModal, setDeletePromoModal] = useState(false);
	const [promoIDToDelete, setPromoIDToDelete] = useState(null);
	const [newPromoModal, setNewPromoModal] = useState(false);
	const [newPromo, setNewPromo] = useState({
		code: '',
		discount: 0,
	});

	useEffect(() => {
		const checkPrivilege = async () => {
			try {
				setLoading(true);
				const userToken = localStorage.getItem('userInfo')
					? JSON.parse(localStorage.getItem('userInfo')).token
					: null;

				const config = {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${userToken}`,
					},
				};

				await axios.post('/v3/user/checkadmin', {}, config);
				setLoading(false);
			} catch (e) {
				const message = e.response && e.response.data.message ? e.response.data.message : e.message;
				setError(message);
				setLoading(false);
				history.push('/');
			}
		};
		checkPrivilege();
	}, [history]);

	const [key, setKey] = useState(match.params.key ? match.params.key : 'orders');

	const [ordersQuery, setOrdersQuery] = useState('');
	const [eventsQuery, setEventsQuery] = useState('');
	const [usersQuery, setUsersQuery] = useState('');
	const [ticketsQuery, setTicketsQuery] = useState('');
	const [promoQuery, setPromoQuery] = useState('');

	const dispatch = useDispatch();

	const adminOrders = useSelector((state) => state.adminOrders);
	const {
		loading: ordersLoading,
		error: ordersError,
		orders,
		pages: ordersPages,
		fetched: ordersFetched,
	} = adminOrders;

	const eventList = useSelector((state) => state.eventList);
	const { loading: eventsLoading, error: eventsError, events, pages: eventsPages } = eventList;

	const adminUsers = useSelector((state) => state.adminUsers);
	const {
		loading: usersLoading,
		error: usersError,
		users,
		pages: usersPages,
		fetched: usersFetched,
	} = adminUsers;

	const adminTickets = useSelector((state) => state.adminTickets);
	const {
		loading: ticketsLoading,
		error: ticketsError,
		tickets,
		pages: ticketsPages,
		fetched: ticketsFetched,
	} = adminTickets;

	const adminPromos = useSelector((state) => state.adminPromos);
	const {
		loading: promosLoading,
		error: promosError,
		promos,
		pages: promosPages,
		fetched: promosFetched,
	} = adminPromos;

	const TabSelectHandler = (k) => {
		setKey(k);
		switch (k) {
			case 'orders':
				history.push(`/dashboard/orders`);
				return;
			case 'events':
				history.push(`/dashboard/events`);
				return;
			case 'users':
				history.push(`/dashboard/users`);
				return;
			case 'tickets':
				history.push(`/dashboard/tickets`);
				return;
			case 'promo':
				history.push(`/dashboard/promo`);
				return;
		}
	};

	// Orders
	const filterOrders = () => {
		if (!ordersQuery) return orders;

		return orders.filter((order) => order._id.toString().includes(ordersQuery));
	};

	const CancelOrderHandler = (orderID) => {
		dispatch(cancelOrder(orderID));
	};

	// Events
	const filterEvents = () => {
		if (!eventsQuery) return events;

		return events.filter((event) =>
			event.name.toString().toLowerCase().includes(eventsQuery.toLowerCase())
		);
	};

	const deleteEventHandler = () => {
		setDeleteEventModal(false);
		dispatch(deleteEvent(eventIDToDelete));
		setEventIDToDelete(null);
	};

	// Users
	const filterUsers = () => {
		if (!usersQuery) return users;

		return users.filter((user) => user.email.toString().toLowerCase().includes(usersQuery.toLowerCase()));
	};

	const deleteUserHandler = () => {
		setDeleteUserModal(false);
		dispatch(deleteUser(userIDToDelete));
		setUserIDToDelete(null);
	};

	const createTicketerHandler = () => {
		if (ticketerEvent) {
			dispatch(createTicketer(ticketerEvent));
			setTicketerEvent('');
		}
	};

	// Tickets
	const filterTickets = () => {
		if (!ticketsQuery) return tickets;

		return tickets.filter((ticket) =>
			ticket._id.toString().toLowerCase().includes(ticketsQuery.toLowerCase())
		);
	};

	const deleteTicketHandler = () => {
		setDeleteTicketModal(false);
		dispatch(deleteTicket(ticketIDToDelete));
		setTicketIDToDelete(null);
	};

	// Promos
	const filterPromos = () => {
		if (!promoQuery) return promos;

		return promos.filter((promo) =>
			promo.code.toString().toLowerCase().includes(promoQuery.toLowerCase())
		);
	};

	const deletePromoHandler = () => {
		setDeletePromoModal(false);
		dispatch(deletePromo(promoIDToDelete));
		setPromoIDToDelete(null);
	};

	const newPromoHandler = (e) => {
		e.preventDefault();
		if (newPromo.code && newPromo.discount > 0 && newPromo.discount <= 100) {
			dispatch(createPromo(newPromo));
		}
		setNewPromoModal(false);
		setNewPromo({ code: '', discount: 0 });
	};

	const pageNo = match.params.pageNo || 1;

	useEffect(() => {
		switch (key) {
			case 'orders':
				dispatch(getAdminOrders(pageNo));
				return;
			case 'events':
				dispatch(listEvents(pageNo));
				return;
			case 'users':
				dispatch(getAdminUsers(pageNo));
				return;
			case 'tickets':
				dispatch(getAdminTickets(pageNo));
				return;
			case 'promo':
				dispatch(getAdminPromos(pageNo));
				return;
		}
	}, [dispatch, key, pageNo]);

	return (
		<>
			<Meta title='Eventify | Admin | Dashboard' />
			<Container>
				{deleteEventModal && (
					<Modal show={deleteEventModal}>
						<Modal.Header>
							<Modal.Title>Attention!</Modal.Title>
						</Modal.Header>
						<Modal.Body>Are you sure you want to delete this event?</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={() => setDeleteEventModal(false)}>
								Cancel
							</Button>
							<Button variant='danger' onClick={deleteEventHandler}>
								Delete
							</Button>
						</Modal.Footer>
					</Modal>
				)}
				{deleteUserModal && (
					<Modal show={deleteUserModal}>
						<Modal.Header>
							<Modal.Title>Attention!</Modal.Title>
						</Modal.Header>
						<Modal.Body>Are you sure you want to delete this user?</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={() => setDeleteUserModal(false)}>
								Cancel
							</Button>
							<Button variant='danger' onClick={deleteUserHandler}>
								Delete
							</Button>
						</Modal.Footer>
					</Modal>
				)}
				{deleteTicketModal && (
					<Modal show={deleteTicketModal}>
						<Modal.Header>
							<Modal.Title>Attention!</Modal.Title>
						</Modal.Header>
						<Modal.Body>Are you sure you want to delete this ticket?</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={() => setDeleteTicketModal(false)}>
								Cancel
							</Button>
							<Button variant='danger' onClick={deleteTicketHandler}>
								Delete
							</Button>
						</Modal.Footer>
					</Modal>
				)}
				{deletePromoModal && (
					<Modal show={deletePromoModal}>
						<Modal.Header>
							<Modal.Title>Attention!</Modal.Title>
						</Modal.Header>
						<Modal.Body>Are you sure you want to delete this promo code?</Modal.Body>
						<Modal.Footer>
							<Button variant='secondary' onClick={() => setDeletePromoModal(false)}>
								Cancel
							</Button>
							<Button variant='danger' onClick={deletePromoHandler}>
								Delete
							</Button>
						</Modal.Footer>
					</Modal>
				)}
				{newPromoModal && (
					<Modal
						show={newPromoModal}
						onHide={() => {
							setNewPromoModal(false);
							setNewPromo({ code: '', discount: 0 });
						}}
					>
						<Modal.Header>
							<Modal.Title className='text-center'>Add a new Promocode</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form onSubmit={newPromoHandler}>
								<Form.Group controlId='code'>
									<Form.Label>Promo Code</Form.Label>
									<Form.Control
										type='text'
										name='code'
										placeholder='Enter Code'
										value={newPromo.code}
										onChange={(e) =>
											setNewPromo({ ...newPromo, [e.target.name]: e.target.value })
										}
									></Form.Control>
								</Form.Group>

								<Form.Group controlId='password'>
									<Form.Label>Discount</Form.Label>
									<Form.Control
										type='number'
										name='discount'
										placeholder='Enter discount'
										value={newPromo.discount}
										onChange={(e) =>
											setNewPromo({ ...newPromo, [e.target.name]: e.target.value })
										}
									></Form.Control>
								</Form.Group>
								<Row>
									<Col>
										<Button type='submit' style={{ width: '100%' }} variant='primary'>
											Add
										</Button>
									</Col>
									<Col>
										<Button
											onClick={() => {
												setNewPromoModal(false);
												setNewPromo({ code: '', discount: 0 });
											}}
											style={{ width: '100%' }}
											variant='primary'
										>
											Cancel
										</Button>
									</Col>
								</Row>
							</Form>
						</Modal.Body>
						{/* <Modal.Footer></Modal.Footer> */}
					</Modal>
				)}
				{loading ? (
					<Loading />
				) : error ? (
					<ErrorMessage variant='danger'>{error}</ErrorMessage>
				) : (
					<Row>
						<Col>
							<Tabs activeKey={key} onSelect={(k) => TabSelectHandler(k)}>
								<Tab eventKey='orders' title='Orders'>
									<Row className='mb-3 mt-2'>
										<Col
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<h2 style={{ display: 'inline-block' }}>User Orders</h2>
											<input
												type='text'
												style={{ minWidth: '20%' }}
												placeholder='Search by ID'
												value={ordersQuery}
												onChange={(e) => setOrdersQuery(e.target.value)}
											/>
										</Col>
									</Row>
									{ordersLoading ? (
										<Loading />
									) : ordersError ? (
										<ErrorMessage variant='danger'>{ordersError}</ErrorMessage>
									) : (
										<>
											<Table striped bordered hover responsive className='table-sm'>
												<thead>
													<tr>
														<th>ID</th>
														<th>DATE</th>
														<th>TOTAL PRICE</th>
														<th>STATUS</th>
														<th>ACTIONS</th>
													</tr>
												</thead>
												<tbody>
													{filterOrders().map((order) => (
														<tr key={order._id}>
															<td>
																<Link to={`/orders/${order._id}`}>
																	{order._id}
																</Link>
															</td>
															<td>{order.createdAt.slice(0, 10)}</td>
															<td>${order.totalPrice}</td>
															<td>{order.paymentDetails.status}</td>
															<td>
																{order.paymentDetails.status !==
																	'CANCELLED' && (
																	<i
																		style={{
																			width: '100%',
																			textAlign: 'center',
																			color: 'red',
																			cursor: 'pointer',
																		}}
																		onClick={() =>
																			CancelOrderHandler(order._id)
																		}
																		className='fas fa-times-circle'
																	></i>
																)}
															</td>
														</tr>
													))}
												</tbody>
											</Table>
											<AdminPaginate pages={ordersPages} page={pageNo} adminOrders />
										</>
									)}
								</Tab>
								<Tab eventKey='events' title='Events'>
									<Row className='mb-3 mt-2'>
										<Col
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<h2 style={{ display: 'inline-block' }}>Events</h2>
											<input
												type='text'
												style={{ minWidth: '20%' }}
												placeholder='Search by name'
												value={eventsQuery}
												onChange={(e) => setEventsQuery(e.target.value)}
											/>
										</Col>
									</Row>
									{eventsLoading ? (
										<Loading />
									) : (
										<>
											{eventsError && !eventsError.startsWith('No') && (
												<ErrorMessage variant='danger'>{eventsError}</ErrorMessage>
											)}
											<Table striped bordered hover responsive className='table-sm'>
												<thead>
													<tr>
														<th>ID</th>
														<th>Name</th>
														<th>Created On</th>
														<th>Ends On</th>
														<th>Available Tickets</th>
														<th># of Participants</th>
														<th>Actions</th>
													</tr>
												</thead>
												<tbody>
													{filterEvents().map((event) => (
														<tr key={event._id}>
															<td>
																<Link to={`/event/details/${event._id}`}>
																	{event._id}
																</Link>
															</td>
															<td>{event.name}</td>
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
															<td>{event.availableTickets}</td>
															<td>{event.joinedUsers.length}</td>
															<td>
																<div
																	style={{
																		width: '100%',
																		textAlign: 'center',
																		display: 'flex',
																		justifyContent: 'space-between',
																	}}
																>
																	<Link
																		to={`/dashboard/editevent/${event._id}`}
																	>
																		<i
																			style={{
																				cursor: 'pointer',
																			}}
																			className='fas fa-edit'
																		></i>
																	</Link>
																	<i
																		onClick={() => {
																			setEventIDToDelete(event._id);
																			setDeleteEventModal(true);
																		}}
																		style={{
																			cursor: 'pointer',
																			color: 'red',
																		}}
																		className='fas fa-trash'
																	></i>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</Table>
											<Row>
												<Col className='text-right'>
													<AdminPaginate
														pages={eventsPages}
														page={pageNo}
														adminEvents
													/>
												</Col>
												<Col md={10} className='text-right'>
													<LinkContainer to='/dashboard/new/create-event'>
														<Button>
															<i className='fas fa-plus'></i> Create New Event
														</Button>
													</LinkContainer>
												</Col>
											</Row>
										</>
									)}
								</Tab>
								<Tab eventKey='users' title='Users'>
									<Row className='mb-3 mt-2'>
										<Col
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<h2 style={{ display: 'inline-block' }}>Users</h2>
											<input
												type='text'
												style={{ minWidth: '20%' }}
												placeholder='Search by email'
												value={usersQuery}
												onChange={(e) => setUsersQuery(e.target.value)}
											/>
										</Col>
									</Row>
									{usersLoading ? (
										<Loading />
									) : usersError ? (
										<ErrorMessage variant='danger'>{usersError}</ErrorMessage>
									) : (
										<>
											<Table striped bordered hover responsive className='table-sm'>
												<thead>
													<tr>
														<th>ID</th>
														<th>NAME</th>
														<th>EMAIL</th>
														<th>VERIFIED</th>
														<th>COUNTRY</th>
														<th>TICKETER</th>
														<th>EVENT?</th>
														<th>ADMIN</th>
														<th>ACTIONS</th>
													</tr>
												</thead>
												<tbody>
													{filterUsers().map((user) => (
														<tr key={user._id}>
															<td>{user._id}</td>
															<td>{user.name}</td>
															<td>{user.email}</td>
															<td>{user.isConfirmed ? 'Yes' : 'No'}</td>
															<td>{user.country}</td>
															<td>{user.ticketer ? 'Yes' : 'No'}</td>
															<td>
																{user.ticketer ? (
																	<Link
																		to={`/event/details/${user.eventID}`}
																	>
																		{user.eventID}{' '}
																	</Link>
																) : (
																	'N/A'
																)}
															</td>
															<td>{user.admin ? 'Yes' : 'No'}</td>
															{!user.admin && (
																<td>
																	<div
																		style={{
																			width: '100%',
																			textAlign: 'center',
																		}}
																	>
																		<i
																			onClick={() => {
																				setUserIDToDelete(user._id);
																				setDeleteUserModal(true);
																			}}
																			style={{
																				cursor: 'pointer',
																				color: 'red',
																			}}
																			className='fas fa-trash'
																		></i>
																	</div>
																</td>
															)}
														</tr>
													))}
												</tbody>
											</Table>
											<Row>
												<Col className='text-right'>
													<AdminPaginate
														pages={usersPages}
														page={pageNo}
														adminUsers
													/>
												</Col>
												<Col md={6} className='text-right'>
													<Button onClick={createTicketerHandler}>
														<i className='fas fa-plus'></i> Create New Ticketer
														Account
													</Button>
												</Col>
												<Col md={4} className='text-right'>
													<Form.Group controlId='name'>
														<Form.Control
															type='text'
															placeholder='Event ID'
															value={ticketerEvent}
															onChange={(e) => setTicketerEvent(e.target.value)}
														></Form.Control>
													</Form.Group>
												</Col>
											</Row>
										</>
									)}
								</Tab>
								<Tab eventKey='tickets' title='Tickets'>
									<Row className='mb-3 mt-2'>
										<Col
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<h2 style={{ display: 'inline-block' }}>User Tickets</h2>
											<input
												type='text'
												style={{ minWidth: '20%' }}
												placeholder='Search by ID'
												value={ticketsQuery}
												onChange={(e) => setTicketsQuery(e.target.value)}
											/>
										</Col>
									</Row>
									{ticketsLoading ? (
										<Loading />
									) : ticketsError ? (
										<ErrorMessage variant='danger'>{ticketsError}</ErrorMessage>
									) : (
										<>
											<Table striped bordered hover responsive className='table-sm'>
												<thead>
													<tr>
														<th>ID</th>
														<th>ORDER</th>
														<th>EVENT</th>
														<th>USER</th>
														<th>Created At</th>
														<th>ACTIONS</th>
													</tr>
												</thead>
												<tbody>
													{filterTickets().map((ticket) => (
														<tr key={ticket._id}>
															<td>{ticket._id}</td>
															<td>
																<Link to={`/orders/${ticket.orderID}`}>
																	{ticket.orderID}
																</Link>
															</td>
															<td>
																<Link to={`/event/details/${ticket.eventID}`}>
																	{ticket.eventName}
																</Link>
															</td>
															<td>{ticket.userID}</td>
															<td>{ticket.createdAt.slice(0, 10)}</td>
															<td>
																<div
																	style={{
																		width: '100%',
																		textAlign: 'center',
																	}}
																>
																	<i
																		onClick={() => {
																			setTicketIDToDelete(ticket._id);
																			setDeleteTicketModal(true);
																		}}
																		style={{
																			cursor: 'pointer',
																			color: 'red',
																		}}
																		className='fas fa-trash'
																	></i>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</Table>
											<AdminPaginate pages={ticketsPages} page={pageNo} adminTickets />
										</>
									)}
								</Tab>
								<Tab eventKey='promo' title='Promo Codes'>
									<Row className='mb-3 mt-2'>
										<Col
											style={{
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<h2 style={{ display: 'inline-block' }}>Available Promo Codes</h2>
											<input
												type='text'
												style={{ minWidth: '20%' }}
												placeholder='Search by code'
												value={promoQuery}
												onChange={(e) => setPromoQuery(e.target.value)}
											/>
										</Col>
									</Row>
									{promosLoading ? (
										<Loading />
									) : (
										<>
											{promosError && !promosError.startsWith('No') && (
												<ErrorMessage variant='danger'>{promosError}</ErrorMessage>
											)}
											<Table striped bordered hover responsive className='table-sm'>
												<thead>
													<tr>
														<th>ID</th>
														<th>CODE</th>
														<th>DISCOUNT</th>
														<th>ACTIONS</th>
													</tr>
												</thead>
												<tbody>
													{filterPromos().map((promo) => (
														<tr key={promo._id}>
															<td>{promo._id}</td>
															<td>{promo.code}</td>
															<td>{promo.discount * 100}%</td>
															<td>
																<div
																	style={{
																		width: '100%',
																		textAlign: 'center',
																	}}
																>
																	<i
																		onClick={() => {
																			setPromoIDToDelete(promo._id);
																			setDeletePromoModal(true);
																		}}
																		style={{
																			cursor: 'pointer',
																			color: 'red',
																		}}
																		className='fas fa-trash'
																	></i>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</Table>
											<Row>
												<Col className='text-right'>
													<AdminPaginate
														pages={promosPages}
														page={pageNo}
														adminPromos
													/>
												</Col>
												<Col md={10} className='text-right'>
													<Button onClick={() => setNewPromoModal(true)}>
														<i className='fas fa-plus'></i> Add New Promocode
													</Button>
												</Col>
											</Row>
										</>
									)}
								</Tab>
							</Tabs>
						</Col>
					</Row>
				)}
			</Container>
		</>
	);
};

export default AdminPage;
