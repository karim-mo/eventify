import React, { useState, useEffect } from 'react';
import Event from '../components/Event';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { listEvents } from '../actions/eventReducerActions';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import axios from 'axios';

const EventScreen = () => {
	const dispatch = useDispatch();

	const eventList = useSelector((state) => state.eventList);
	const { loading, success, error, events } = eventList;

	useEffect(() => {
		dispatch(listEvents());
	}, []);

	return (
		<>
			<Container>
				<div
					style={{
						borderBottom: '2px solid gray',
					}}
				>
					<h1>Latest Events</h1>
				</div>
				{loading ? (
					<Loading />
				) : !success ? (
					<ErrorMessage variant='danger'>{error}</ErrorMessage>
				) : (
					<Row className='mt-4'>
						{events.map((event) => (
							<Col key={event._id} sm={12} md={4}>
								<Event event={event} />
							</Col>
						))}
					</Row>
				)}
			</Container>
		</>
	);
};

export default EventScreen;
