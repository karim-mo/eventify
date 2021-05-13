import React from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AdminPaginate = ({
	pages,
	page,
	adminOrders = false,
	adminTickets = false,
	adminEvents = false,
	adminUsers = false,
	adminPromos = false,
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
									adminOrders
										? `/dashboard/orders/page/${pageNo + 1}`
										: adminEvents
										? `/dashboard/events/page/${pageNo + 1}`
										: adminTickets
										? `/dashboard/tickets/page/${pageNo + 1}`
										: adminUsers
										? `/dashboard/users/page/${pageNo + 1}`
										: adminPromos && `/dashboard/promo/page/${pageNo + 1}`
								}
							>
								<Pagination.Item active={pageNo + 1 === page}>{pageNo + 1}</Pagination.Item>
							</LinkContainer>
						))}
					</Pagination>
				</Col>
			</Row>
		)
	);
};

export default AdminPaginate;
