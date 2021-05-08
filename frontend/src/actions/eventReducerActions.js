import axios from 'axios';
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
import { logoutUser } from './userReducerActions';

export const listEvents = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EVENT_LIST_REQUEST,
		});

		const { data } = await axios.get(
			`/eventifyapi/events?pageNo=${pageNo}`
		);

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

export const getUserHostedEvents = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_EVENTS_REQUEST,
		});

		const {
			userInfo: { user },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		};

		const { data } = await axios.get(
			`/eventifyapi/events/userevents?pageNo=${pageNo}`,
			config
		);

		dispatch({
			type: USER_EVENTS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message =
			e.response && e.response.data.message
				? e.response.data.message
				: e.message;
		if (
			message === 'Not authorized, token failed' ||
			message === 'Not authorized, no token'
		) {
			dispatch(logoutUser());
		}
		dispatch({
			type: USER_EVENTS_FAIL,
			payload: message,
		});
	}
};
