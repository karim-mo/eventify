import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Event = ({ event }) => {
	const eventEnded = (day, month, year) => {
		const today = new Date();
		const date = new Date(year, month - 1, day + 1);

		return today > date;
	};

	return (
		<Card
			className='text-white bg-secondary mb-3'
			style={{
				minHeight: '25rem',
			}}
		>
			<LinkContainer to={`/event/details/${event._id}`}>
				<Card.Header className='mt-2'>
					<h3
						style={{
							cursor: 'pointer',
						}}
					>
						{event.name}
					</h3>
				</Card.Header>
			</LinkContainer>

			<Card.Body>
				<p>{event.description}</p>
			</Card.Body>
			<Card.Body>
				<Row>
					<Col sm={12} md={7}>
						Created By <cite>{event.author}</cite>
					</Col>
					<Col sm={12} md={5}>
						<LinkContainer to={`/event/details/${event._id}`} className='text-white'>
							<a>
								Check it out <i className='fas fa-arrow-right'></i>
							</a>
						</LinkContainer>
					</Col>
				</Row>
			</Card.Body>
			<Card.Footer className='text-muted text-center'>
				{eventEnded(event.endsOn.day, event.endsOn.month, event.endsOn.year)
					? `Ticket buying ended on ${event.endsOn.day} / ${event.endsOn.month} / ${event.endsOn.year}`
					: `Ticket buying ends on ${event.endsOn.day} / ${event.endsOn.month} / ${event.endsOn.year}`}
			</Card.Footer>
		</Card>
	);
};

export default Event;
