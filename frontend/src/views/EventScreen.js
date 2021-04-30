import React, { useState, useEffect } from 'react';
import Event from '../components/Event';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Jumbotron, Row } from 'react-bootstrap';
import { listEvents } from '../actions/eventReducerActions';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Zoom from '@material-ui/core/Zoom';
import Fade from '@material-ui/core/Fade';

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
						{events.map((event, index) => (
							<Fade
								key={event._id}
								in={true}
								style={{
									transitionDelay: `${index * 150}ms`,
								}}
							>
								<Col sm={12} md={4}>
									<Event event={event} />
								</Col>
							</Fade>
						))}
					</Row>
				)}
			</Container>
		</>
	);
};

export default EventScreen;
