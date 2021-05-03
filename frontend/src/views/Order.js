import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	ListGroup,
	Image,
	Card,
	Button,
	Container,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../components/ErrorMessage';
import {
	getOrderDetails_Capture,
	getOrderDetails_NoCapture,
} from '../actions/orderReducerActions';
import Loading from '../components/Loading';

const Order = ({ match, history }) => {
	const dispatch = useDispatch();

	const orderDetails = useSelector((state) => state.orderDetails);
	const { loading, fetched, order, error } = orderDetails;

	const userInfo = useSelector((state) => state.userInfo);
	const { isLogged } = userInfo;

	const userToken = localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo')).token
		: null;

	const [paymentLoading, setPaymentLoading] = useState(false);
	const [paymentError, setPaymentError] = useState(null);

	useEffect(() => {
		if (!isLogged) {
			history.push('/');
		} else {
			dispatch(getOrderDetails_Capture(match.params.id));
		}
	}, [dispatch, history, isLogged]);

	useEffect(() => {
		if (paymentError) {
			setTimeout(() => {
				setPaymentError(null);
			}, 5000);
		}
	}, [paymentError]);

	const createOrder = async (data, actions) => {
		let token;
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
			};

			const { data: response } = await axios.get(
				`/eventifyapi/orders/paypal/${order.id}`,
				config
			);
			if (response.message) {
				throw new Error(response.message);
			}

			token = response.paymentID;
		} catch (e) {
			setPaymentError(
				e.response && e.response.data.message
					? e.response.data.message
					: e.message
			);
		} finally {
			if (!token) token = 'NULL';
			return token;
		}
	};

	const onApprove = async (data, actions) => {
		try {
			dispatch({
				type: 'ORDER_DETAILS_REQUEST',
			});
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${userToken}`,
				},
			};
			dispatch(getOrderDetails_NoCapture(order.id));
			const { data: response } = await axios.post(
				`/eventifyapi/orders/userorders`,
				{ orderID: order.id },
				config
			);
			if (response.message) {
				throw new Error(response.message);
			}
			dispatch(getOrderDetails_NoCapture(order.id));
		} catch (e) {
			setPaymentError(
				e.response && e.response.data.message
					? e.response.data.message
					: e.message
			);
		}
	};

	return (
		<Container>
			{paymentError && (
				<ErrorMessage variant='danger'>{paymentError}</ErrorMessage>
			)}
			{loading ? (
				<Loading />
			) : error ? (
				<ErrorMessage variant='danger'>{error}</ErrorMessage>
			) : (
				<>
					<h1>Order #{order.id}</h1>
					<Row>
						<Col md={8}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Issuer Details</h2>
									<p>
										<strong>Name: </strong> {order.name}
									</p>
									<p>
										<strong>Email: </strong>{' '}
										<a href={`mailto:${order.email}`}>
											{order.email}
										</a>
									</p>
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Order Status</h2>
									{order.paymentDetails.status ===
									'PENDING' ? (
										<ErrorMessage variant='info'>
											STATUS: AWAITING PAYMENT
										</ErrorMessage>
									) : order.paymentDetails.status ===
									  'APPROVED' ? (
										<ErrorMessage variant='warning'>
											STATUS: PROCESSING PAYMENT
										</ErrorMessage>
									) : (
										<ErrorMessage variant='success'>
											STATUS: COMPLETED
										</ErrorMessage>
									)}
								</ListGroup.Item>

								<ListGroup.Item>
									<h2>Order Items</h2>
									{order.orderItems.length === 0 ? (
										<ErrorMessage variant='info'>
											Order is empty.
										</ErrorMessage>
									) : (
										<ListGroup variant='flush'>
											{order.orderItems.map((ticket) => (
												<ListGroup.Item
													key={ticket._id}
												>
													<Row>
														<Col xs={10} md={10}>
															<Link
																to={`/event/details/${ticket.eventID}`}
															>
																{ticket.name}
															</Link>
														</Col>
														<Col xs={2} md={2}>
															$
															{ticket.ticketPrice}
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={4}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Order Summary</h2>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col xs={10} md={8}>
											Items
										</Col>
										<Col xs={2} md={4}>
											${order.itemsPrice}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col xs={10} md={8}>
											Fees
										</Col>
										<Col xs={2} md={4}>
											${order.fees}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col xs={10} md={8}>
											Total
										</Col>
										<Col xs={2} md={4}>
											${order.totalPrice}
										</Col>
									</Row>
								</ListGroup.Item>
								{order.paymentDetails.status === 'PENDING' ? (
									paymentLoading ? (
										<ListGroup.Item>
											<Loading />
										</ListGroup.Item>
									) : (
										<ListGroup.Item>
											<PayPalButton
												createOrder={(data, actions) =>
													createOrder(data, actions)
												}
												onApprove={(data, actions) =>
													onApprove(data, actions)
												}
											/>
										</ListGroup.Item>
									)
								) : null}
							</ListGroup>
						</Col>
					</Row>
				</>
			)}
		</Container>
	);
};

export default Order;
