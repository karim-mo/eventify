import {
	ADMIN_TICKETS_FAIL,
	ADMIN_TICKETS_REQUEST,
	ADMIN_TICKETS_SUCCESS,
	PUBLIC_TICKET_DETAILS_FAIL,
	PUBLIC_TICKET_DETAILS_REQUEST,
	PUBLIC_TICKET_DETAILS_SUCCESS,
	TICKET_DETAILS_FAIL,
	TICKET_DETAILS_REQUEST,
	TICKET_DETAILS_SUCCESS,
	USER_TICKETS_FAIL,
	USER_TICKETS_REQUEST,
	USER_TICKETS_SUCCESS,
} from '../types';

export const userTicketsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case USER_TICKETS_REQUEST:
			return { loading: true };
		case USER_TICKETS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				tickets: action.payload.tickets,
				pages: action.payload.pages,
			};
		case USER_TICKETS_FAIL:
			return {
				loading: false,
				fetched: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export const ticketDetailsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case TICKET_DETAILS_REQUEST:
			return { loading: true };
		case TICKET_DETAILS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				ticket: action.payload,
			};
		case TICKET_DETAILS_FAIL:
			return {
				loading: false,
				fetched: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export const publicTicketDetailsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case PUBLIC_TICKET_DETAILS_REQUEST:
			return { loading: true };
		case PUBLIC_TICKET_DETAILS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				ticket: action.payload,
			};
		case PUBLIC_TICKET_DETAILS_FAIL:
			return {
				loading: false,
				fetched: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export const adminTicketsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case ADMIN_TICKETS_REQUEST:
			return { loading: true };
		case ADMIN_TICKETS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				tickets: action.payload.tickets,
				pages: action.payload.pages,
			};
		case ADMIN_TICKETS_FAIL:
			return {
				loading: false,
				fetched: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
