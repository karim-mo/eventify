import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Button, Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import {
	addUserComment,
	getEventDetails,
	toggleCommentHeart,
} from '../actions/eventReducerActions';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { addToCart } from '../actions/userReducerActions';
import Snackbar from '../components/Snackbar';

const EventDetails = ({ match }) => {
	const [message, setMessage] = useState(null);
	const [successMessage, setsuccessMessage] = useState(null);
	const [open, setOpen] = useState(false);
	const [errorSnackOpen, setErrorSnackOpen] = useState(false);
	const [commentErrorSnackOpen, setCommentErrorSnackOpen] = useState(false);
	const [commentErrorText, setCommentErrorText] = useState(null);
	const [commentText, setCommentText] = useState('');

	const eventEnded = (day, month, year) => {
		const today = new Date();
		const date = new Date(year, month - 1, day + 1);

		return today > date;
	};
	useEffect(() => {
		if (message) {
			setTimeout(() => setMessage(null), 3000);
		}
	}, [message]);

	useEffect(() => {
		if (errorSnackOpen) {
			setTimeout(() => setErrorSnackOpen(null), 3000);
		}
	}, [errorSnackOpen]);

	useEffect(() => {
		if (open) {
			setTimeout(() => setOpen(false), 3000);
		}
	}, [open]);

	useEffect(() => {
		if (commentErrorSnackOpen) {
			setTimeout(() => setCommentErrorSnackOpen(false), 3000);
		}
	}, [commentErrorSnackOpen]);

	const dispatch = useDispatch();
	const eventDetails = useSelector((state) => state.eventDetails);
	const { loading, success, error, event, commentError } = eventDetails;

	const userInfo = useSelector((state) => state.userInfo);
	const {
		loading: cartLoading,
		error: cartError,
		addToCartSuccess: cartSuccess,
		isLogged,
		user,
	} = userInfo;

	useEffect(() => {
		if (cartError) {
			setOpen(false);
			setMessage(cartError);
			setErrorSnackOpen(true);
			dispatch({ type: 'USER_CART_RESET' });
		}
	}, [dispatch, cartError]);

	useEffect(() => {
		if (cartSuccess) {
			setOpen(true);
			dispatch({ type: 'USER_CART_RESET' });
		}
	}, [dispatch, cartSuccess]);

	useEffect(() => {
		if (commentError) {
			setOpen(false);
			setErrorSnackOpen(false);
			setCommentErrorText(commentError);
			setCommentErrorSnackOpen(true);
			dispatch({ type: 'COMMENT_ERROR_RESET' });
		}
	}, [dispatch, commentError]);

	const addToCartHandler = (id) => {
		dispatch(addToCart(id));
	};

	useEffect(() => {
		dispatch(getEventDetails(match.params.id));
	}, [match]);

	const addCommentHandler = () => {
		if (commentText !== '') {
			dispatch(addUserComment(match.params.id, commentText));
			setCommentText('');
		} else {
			setErrorSnackOpen(false);
			setOpen(false);
			setCommentErrorText('Comment cannot be empty.');
			setCommentErrorSnackOpen(true);
		}
	};

	const isHeartedByUser = (commentID) => {
		if (!isLogged || !canComment()) return true;
		const comment = event.comments.find(
			(_comment) => _comment._id.toString() === commentID.toString()
		);
		if (comment) {
			if (
				comment.heartedBy.find(
					(_user) => _user.userID.toString() === user.id.toString()
				)
			)
				return true;
		}
		return false;
	};

	const canComment = () => {
		if (
			isLogged &&
			event.joinedUsers.find(
				(joinedUser) =>
					joinedUser.userID.toString() === user.id.toString()
			)
		)
			return true;
		return false;
	};

	const toggleCommentHeartHandler = (commentID) => {
		if (!isLogged || !canComment()) return;
		dispatch(toggleCommentHeart(match.params.id, commentID));
	};

	return (
		<div>
			<Container>
				<div style={{ marginBottom: '10px' }}>
					<LinkContainer to='/events'>
						<a>GO BACK</a>
					</LinkContainer>
				</div>
				{commentErrorSnackOpen && (
					<Snackbar
						open={commentErrorSnackOpen}
						variant='error'
						message={commentErrorText}
					/>
				)}
				{errorSnackOpen && (
					<Snackbar
						open={errorSnackOpen}
						variant='error'
						message={message}
					/>
				)}
				{open && (
					<Snackbar
						open={open}
						variant='success'
						message='Added to Cart'
					/>
				)}
				{loading ? (
					<Loading />
				) : error ? (
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
								{cartLoading ? (
									<Loading />
								) : (
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
													{event.virtual
														? 'Yes'
														: 'No'}
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
														style={{
															width: '100%',
														}}
														disabled={
															eventEnded(
																event.endsOn
																	.day,
																event.endsOn
																	.month,
																event.endsOn
																	.year
															) ||
															event.availableTickets <=
																0 ||
															!isLogged
														}
														onClick={() =>
															addToCartHandler(
																event._id
															)
														}
													>
														Buy Ticket
													</Button>
												</Col>
											</Row>
										</ListGroup.Item>
									</ListGroup>
								)}
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

						{event.comments.length > 0 || canComment() ? (
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
									{canComment() && (
										<ListGroup className='mb-3'>
											<ListGroup.Item>
												<Row>
													<Col
														sm={1}
														className='mt-2'
													>
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
														<textarea
															style={{
																width: '100%',
																maxHeight:
																	'100px',
																minHeight:
																	'40px',
																resize: 'none',
															}}
															maxLength='200'
															placeholder='Add a comment...'
															value={commentText}
															onChange={(e) =>
																setCommentText(
																	e.target
																		.value
																)
															}
														></textarea>
													</Col>
													<Col className='text-right mt-2'>
														<Button
															onClick={
																addCommentHandler
															}
														>
															Comment
														</Button>
													</Col>
												</Row>
											</ListGroup.Item>
										</ListGroup>
									)}
									{event.comments.length > 0 && (
										<ListGroup variant='flush'>
											{event.comments.map((comment) => (
												<ListGroup.Item
													key={comment._id}
												>
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
																marginLeft:
																	'-3%',
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
															<p>
																{
																	comment.comment
																}
															</p>
														</Col>
														<Col className='text-right'>
															{comment.hearts}{' '}
															{isHeartedByUser(
																comment._id
															) ? (
																<i
																	onClick={() =>
																		toggleCommentHeartHandler(
																			comment._id
																		)
																	}
																	className='fas fa-heart'
																></i>
															) : (
																<i
																	onClick={() =>
																		toggleCommentHeartHandler(
																			comment._id
																		)
																	}
																	className='fas fa-heart-broken'
																></i>
															)}
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									)}
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
