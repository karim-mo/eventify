import {
	EVENT_DETAILS_FAIL,
	EVENT_DETAILS_REQUEST,
	EVENT_DETAILS_SUCCESS,
	EVENT_LIST_FAIL,
	EVENT_LIST_REQUEST,
	EVENT_LIST_SUCCESS,
	USER_EVENTS_FAIL,
	USER_EVENTS_REQUEST,
	USER_EVENTS_SUCCESS,
} from '../types';

export const eventListReducer = (
	state = { events: [], loading: true },
	action
) => {
	switch (action.type) {
		case EVENT_LIST_REQUEST:
			return { ...state, loading: true };
		case EVENT_LIST_SUCCESS:
			return {
				loading: false,
				success: true,
				events: action.payload.events,
				pages: action.payload.pages,
			};
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

export const userEventsReducer = (state = { loading: true }, action) => {
	switch (action.type) {
		case USER_EVENTS_REQUEST:
			return { loading: true };
		case USER_EVENTS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				events: action.payload.events,
				pages: action.payload.pages,
			};
		case USER_EVENTS_FAIL:
			return {
				loading: false,
				fetched: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
