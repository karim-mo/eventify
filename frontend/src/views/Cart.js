import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
	Container,
	Modal,
} from 'react-bootstrap';
import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import { removeFromCart, getCart } from '../actions/userReducerActions';
import Snackbar from '../components/Snackbar';

const Cart = ({ history }) => {
	const [open, setOpen] = useState(false);
	const [placeOrderPrompt, setPlaceOrderPrompt] = useState(false);

	const dispatch = useDispatch();

	const userInfo = useSelector((state) => state.userInfo);
	const { loading, isLogged, error, removeFromCartSuccess, user } = userInfo;

	useEffect(() => {
		if (open) {
			setTimeout(() => setOpen(false), 3000);
		}
	}, [open]);

	useEffect(() => {
		if (removeFromCartSuccess) {
			setOpen(true);
			dispatch({ type: 'USER_CART_RESET' });
		}
	}, [dispatch, removeFromCartSuccess]);

	useEffect(() => {
		if (!isLogged) {
			history.push('/');
		} else {
			dispatch(getCart());
		}
	}, [dispatch, history, isLogged]);

	const removeTicketFromCart = (eventID) => {
		dispatch(removeFromCart(eventID));
	};

	const placeOrderHandler = () => {
		setPlaceOrderPrompt(true);
	};

	return (
		<Container>
			{error && <ErrorMessage variant='danger'>{error}</ErrorMessage>}
			{open && (
				<Snackbar
					open={open}
					variant='success'
					message='Removed Item From Cart'
				/>
			)}
			{placeOrderPrompt && (
				<Modal show={placeOrderPrompt}>
					<Modal.Header>
						<Modal.Title>Attention!</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						Placing an order will clear your cart contents and
						you'll be redirected to Checkout to finish your payment
						process, If you wish to add or remove your cart
						contents, you may close this window and do so now.
					</Modal.Body>
					<Modal.Footer>
						<Button
							variant='secondary'
							onClick={() => setPlaceOrderPrompt(false)}
						>
							Close
						</Button>
						<Button
							variant='primary'
							onClick={() => console.log('To order')}
						>
							Proceed To Checkout
						</Button>
					</Modal.Footer>
				</Modal>
			)}
			<Row>
				{loading ? (
					<Loading />
				) : (
					<>
						<Col md={8}>
							<h1>Ticket Cart</h1>
							{isLogged && user.cart.length === 0 ? (
								<ErrorMessage variant='info'>
									Your cart is empty{' '}
									<Link to='/'>Go Home</Link>
								</ErrorMessage>
							) : (
								isLogged && (
									<>
										<ListGroup variant='flush'>
											{user.cart.map((ticket) => (
												<ListGroup.Item
													key={ticket._id}
												>
													<Row>
														<Col xs={6} md={6}>
															<Link
																to={`/event/details/${ticket.eventID}`}
															>
																{ticket.name}
															</Link>
														</Col>
														<Col xs={4} md={4}>
															$
															{ticket.ticketPrice}
														</Col>

														<Col xs={2} md={1}>
															<Button
																type='button'
																variant='light'
																onClick={() =>
																	removeTicketFromCart(
																		ticket.eventID
																	)
																}
															>
																<i className='fas fa-trash'></i>
															</Button>
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									</>
								)
							)}
						</Col>
						{isLogged && (
							<Col md={4}>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<h2>
											Subtotal (
											{user.cart.reduce(
												(acc, ticket) => acc + 1,
												0
											)}
											) tickets
										</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col xs={9} md={9}>
												Items Total:
											</Col>
											<Col>
												$
												{user.cart
													.reduce(
														(acc, ticket) =>
															acc +
															ticket.ticketPrice,
														0
													)
													.toFixed(2)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col xs={9} md={9}>
												Fees:
											</Col>
											<Col>
												$
												{user.cart
													.reduce(
														(acc, ticket) =>
															acc +
															0.05 *
																ticket.ticketPrice,
														0
													)
													.toFixed(2)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col xs={9} md={9}>
												Total:
											</Col>
											<Col>
												$
												{user.cart
													.reduce(
														(acc, ticket) =>
															acc +
															1.05 *
																ticket.ticketPrice,
														0
													)
													.toFixed(2)}
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Button
											type='button'
											className='btn-block'
											disabled={
												user.cart.length === 0 ||
												loading
											}
											onClick={placeOrderHandler}
										>
											Place Order
										</Button>
									</ListGroup.Item>
								</ListGroup>
							</Col>
						)}
					</>
				)}
			</Row>
		</Container>
	);
};

export default Cart;
