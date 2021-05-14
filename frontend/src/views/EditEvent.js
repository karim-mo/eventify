import React, { useState, useEffect, useMemo } from 'react';
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
import { deleteEvent, editEventbyID, getEventDetails, listEvents } from '../actions/eventReducerActions';
import axios from 'axios';
import countryList from 'react-select-country-list';
import Select from 'react-select';

const EditEvent = ({ match, history }) => {
	const dispatch = useDispatch();
	const options = useMemo(() => countryList().getData(), []);
	const eventDetails = useSelector((state) => state.eventDetails);
	const { loading: eventLoading, error: eventError, event, success: eventSuccess } = eventDetails;

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fieldError, setFieldError] = useState(null);
	const [name, setName] = useState('');
	const [image, setImage] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [ticketPrice, setTicketPrice] = useState(0);
	const [availableTickets, setAvailableTickets] = useState(0);
	const [eventCountry, setEventCountry] = useState([]);
	const [len, setLen] = useState(0);
	const [endsOnYear, setEndsOnYear] = useState(0);
	const [endsOnMonth, setEndsOnMonth] = useState(0);
	const [endsOnDay, setEndsOnDay] = useState(0);

	const eventID = match.params.id;

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

	useEffect(() => {
		if (!loading && !error) {
			dispatch(getEventDetails(eventID));
		}
	}, [dispatch, loading]);

	useEffect(() => {
		if (eventSuccess) {
			setName(event.name);
			setImage(event.image);
			setDescription(event.description);
			setCategory(event.category);
			setTicketPrice(event.ticketPrice);
			setAvailableTickets(event.availableTickets);
			setEventCountry(event.eventCountry);
			setEndsOnYear(event.endsOn.year);
			setEndsOnMonth(event.endsOn.month);
			setEndsOnDay(event.endsOn.day);
		}
	}, [eventSuccess]);

	useEffect(() => {
		if (eventCountry.length > 0) {
			setLen(eventCountry.length);
		}
	}, [eventCountry]);

	const evaluateEventCountries = (index, CC) => {
		let updatedCountries = [...eventCountry];
		if (updatedCountries[index].countryCode !== CC) {
			updatedCountries[index] = {
				countryCode: CC,
			};
		}
		// console.log(CC);

		// if (!updatedCountries.find((cc) => cc.countryCode === CC)) {
		// 	updatedCountries.push({
		// 		countryCode: CC,
		// 	});
		// } else {
		// 	const index = updatedCountries.indexOf({ countryCode: CC });
		// 	updatedCountries.splice(index);
		// }
		setEventCountry(updatedCountries);
	};

	const EditEventHandler = (e) => {
		e.preventDefault();
		if (
			!name ||
			!image ||
			!description ||
			!category ||
			ticketPrice < 0 ||
			availableTickets < 0 ||
			eventCountry.length <= 0 ||
			endsOnDay <= 0 ||
			endsOnMonth <= 0 ||
			endsOnYear <= 0
		) {
			setFieldError('All fields should be complete');
		} else {
			dispatch(
				editEventbyID({
					eventID,
					name,
					image,
					description,
					category,
					ticketPrice,
					availableTickets,
					eventCountry,
					endsOnYear,
					endsOnMonth,
					endsOnDay,
				})
			);
		}
	};

	return (
		<Container>
			{loading ? (
				<Loading />
			) : error ? (
				<ErrorMessage variant='danger'>{error}</ErrorMessage>
			) : (
				<>
					{eventLoading ? (
						<Loading />
					) : eventError ? (
						<ErrorMessage variant='danger'>{eventError}</ErrorMessage>
					) : (
						<Row className='justify-content-md-center'>
							<Col xs={12} md={6}>
								<h1>Event Details</h1>
								<Form onSubmit={(e) => EditEventHandler(e)}>
									<Form.Group controlId='name'>
										<Form.Label>Name</Form.Label>
										<Form.Control
											type='text'
											placeholder='Event Name'
											value={name}
											onChange={(e) => setName(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId='image'>
										<Form.Label>Image</Form.Label>
										<Form.Control
											type='text'
											placeholder='Event Image'
											value={image}
											onChange={(e) => setImage(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId='description'>
										<Form.Label>Description</Form.Label>
										<textarea
											cols='30'
											rows='10'
											style={{
												width: '100%',
												height: '100px',
												resize: 'none',
												border: '2px solid #333',
											}}
											value={description}
											onChange={(e) => setDescription(e.target.value)}
										></textarea>
									</Form.Group>
									<Form.Group controlId='category'>
										<Form.Label> Category</Form.Label>
										<Form.Control
											type='text'
											placeholder='Event Category'
											value={category}
											onChange={(e) => setCategory(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId='price'>
										<Form.Label>Ticket Price</Form.Label>
										<Form.Control
											type='number'
											placeholder='Event Ticket Price'
											value={ticketPrice}
											onChange={(e) => setTicketPrice(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId='availTickets'>
										<Form.Label> Available tickets</Form.Label>
										<Form.Control
											type='number'
											placeholder='Event Available Tickets'
											value={availableTickets}
											onChange={(e) => setAvailableTickets(e.target.value)}
										></Form.Control>
									</Form.Group>
									<Form.Group controlId='name'>
										<Form.Label>Country Codes</Form.Label>
										{[...Array(len).keys()].map((x) => (
											<Form.Control
												key={x}
												className='mb-1'
												as='select'
												value={
													(eventCountry[x] && eventCountry[x].countryCode) ||
													'Select a country'
												}
												onChange={(e) => evaluateEventCountries(x, e.target.value)}
											>
												{options
													.map((option, index) => {
														if (
															eventCountry.find((cc) => {
																if (
																	x < eventCountry.length &&
																	option.value !==
																		eventCountry[x].countryCode &&
																	cc.countryCode === option.value
																) {
																	return true;
																} else if (
																	x >= eventCountry.length &&
																	cc.countryCode === option.value
																) {
																	return true;
																}
																return false;
															})
														) {
															return;
														}
														return (
															<option key={index}>{`${option.value}`}</option>
														);
													})
													.filter((option) => option)}
											</Form.Control>
										))}
									</Form.Group>
									<Row className='mb-2'>
										<Col>
											<Button
												onClick={() => {
													setLen(len + 1);
													let cc = 'n/a';
													let i = 0;
													while (
														eventCountry.find(
															(cc) => cc.countryCode === options[i].value
														)
													) {
														i++;
													}
													cc = options[i].value;
													setEventCountry([...eventCountry, { countryCode: cc }]);
												}}
												style={{ width: '100%' }}
											>
												Add Country Field
											</Button>
										</Col>
										<Col>
											<Button
												onClick={() => {
													if (len > 0) {
														setLen(len - 1);
														setEventCountry(
															eventCountry.filter(
																(x, i) => i !== eventCountry.length - 1
															)
														);
													}
												}}
												style={{ width: '100%' }}
											>
												Remove Country Field
											</Button>
										</Col>
									</Row>

									<Form.Group controlId='date'>
										<Form.Label>Ends On</Form.Label>
										<Row>
											<Col>
												<Form.Label>Day</Form.Label>
												<Form.Control
													className='mb-1'
													as='select'
													value={endsOnDay.toLocaleString('en-US', {
														minimumIntegerDigits: 2,
														useGrouping: false,
													})}
													onChange={(e) => setEndsOnDay(e.target.value)}
												>
													{[...Array(30).keys()].map((day) => (
														<option key={day}>
															{(day + 1).toLocaleString('en-US', {
																minimumIntegerDigits: 2,
																useGrouping: false,
															})}
														</option>
													))}
												</Form.Control>
											</Col>
											<Col>
												<Form.Label>Month</Form.Label>
												<Form.Control
													className='mb-1'
													as='select'
													value={endsOnMonth.toLocaleString('en-US', {
														minimumIntegerDigits: 2,
														useGrouping: false,
													})}
													onChange={(e) => setEndsOnMonth(e.target.value)}
												>
													{[...Array(12).keys()].map((month) => (
														<option key={month}>
															{(month + 1).toLocaleString('en-US', {
																minimumIntegerDigits: 2,
																useGrouping: false,
															})}
														</option>
													))}
												</Form.Control>
											</Col>
											<Col>
												<Form.Label>Year</Form.Label>
												<Form.Control
													className='mb-1'
													as='select'
													value={endsOnYear}
													onChange={(e) => setEndsOnYear(e.target.value)}
												>
													{[...Array(200).keys()]
														.map((year) => (
															<option key={year}>
																{(year + 1900).toLocaleString('en-US', {
																	minimumIntegerDigits: 4,
																	useGrouping: false,
																})}
															</option>
														))
														.sort((a, b) => {
															return a > b;
														})}
												</Form.Control>
											</Col>
										</Row>
									</Form.Group>

									<Button style={{ width: '100%' }} type='submit' variant='primary'>
										Save Changes
									</Button>
								</Form>
							</Col>
						</Row>
					)}
				</>
			)}
		</Container>
	);
};

export default EditEvent;
