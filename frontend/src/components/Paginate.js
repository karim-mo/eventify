import React from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({
	pages,
	page,
	adminPage = false,
	profileOrders = false,
	profileName,
	profileTickets = false,
	profileHostedEvents = false,
}) => {
	return (
		pages > 1 && (
			<Row>
				<Col className='paginate'>
					<Pagination>
						{[...Array(pages).keys()].map((pageNo) => (
							<LinkContainer
								key={pageNo + 1}
								to={
									profileOrders
										? `/members/${profileName}/profile/orders/page/${
												pageNo + 1
										  }`
										: profileHostedEvents
										? `/members/${profileName}/profile/hosted/page/${
												pageNo + 1
										  }`
										: profileTickets
										? `/members/${profileName}/profile/tickets/page/${
												pageNo + 1
										  }`
										: `/events/page/${pageNo + 1}`
								}
							>
								<Pagination.Item active={pageNo + 1 === page}>
									{pageNo + 1}
								</Pagination.Item>
							</LinkContainer>
						))}
					</Pagination>
				</Col>
			</Row>
		)
	);
};

export default Paginate;
