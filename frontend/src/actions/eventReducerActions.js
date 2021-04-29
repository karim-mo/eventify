import axios from 'axios';
import {
	EVENT_DETAILS_FAIL,
	EVENT_DETAILS_REQUEST,
	EVENT_DETAILS_SUCCESS,
	EVENT_LIST_FAIL,
	EVENT_LIST_REQUEST,
	EVENT_LIST_SUCCESS,
} from '../types';

export const listEvents = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: EVENT_LIST_REQUEST,
		});

		const { data } = await axios.get('/eventifyapi/events');

		dispatch({
			type: EVENT_LIST_SUCCESS,
			payload: data,
		});
	} catch (e) {
		dispatch({
			type: EVENT_LIST_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};

export const getEventDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EVENT_DETAILS_REQUEST,
		});

		const { data } = await axios.get(`/eventifyapi/events/${id}`);

		dispatch({
			type: EVENT_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		dispatch({
			type: EVENT_DETAILS_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};
