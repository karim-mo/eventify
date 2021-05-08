import {
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
