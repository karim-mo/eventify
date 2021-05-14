import {
	ADMIN_PROMOS_FAIL,
	ADMIN_PROMOS_REQUEST,
	ADMIN_PROMOS_SUCCESS,
	ADMIN_TICKETS_FAIL,
	ADMIN_TICKETS_REQUEST,
	ADMIN_TICKETS_SUCCESS,
} from '../types';

export const adminPromosReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case ADMIN_PROMOS_REQUEST:
			return { loading: true };
		case ADMIN_PROMOS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				promos: action.payload.promos,
				pages: action.payload.pages,
			};
		case ADMIN_PROMOS_FAIL:
			return {
				loading: false,
				fetched: false,
				promos: [],
				pages: 0,
				error: action.payload,
			};
		default:
			return state;
	}
};
