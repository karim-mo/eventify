import {
	EVENT_DETAILS_FAIL,
	EVENT_DETAILS_REQUEST,
	EVENT_DETAILS_SUCCESS,
	EVENT_LIST_FAIL,
	EVENT_LIST_REQUEST,
	EVENT_LIST_SUCCESS,
} from '../types';

export const eventListReducer = (
	state = { events: [], loading: true },
	action
) => {
	switch (action.type) {
		case EVENT_LIST_REQUEST:
			return { ...state, loading: true };
		case EVENT_LIST_SUCCESS:
			return { loading: false, success: true, events: action.payload };
		case EVENT_LIST_FAIL:
			return { loading: false, success: false, error: action.payload };
		default:
			return state;
	}
};

export const eventDetailsReducer = (
	state = {
		event: {
			joinedUsers: [],
			comments: [],
			eventCountry: [],
			endsOn: {},
		},
		loading: true,
	},
	action
) => {
	switch (action.type) {
		case EVENT_DETAILS_REQUEST:
			return { ...state, loading: true };
		case EVENT_DETAILS_SUCCESS:
			return { loading: false, success: true, event: action.payload };
		case EVENT_DETAILS_FAIL:
			return { loading: false, success: false, error: action.payload };
		default:
			return state;
	}
};
