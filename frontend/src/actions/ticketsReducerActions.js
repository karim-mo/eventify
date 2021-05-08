import {
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

import axios from 'axios';
import { logoutUser } from './userReducerActions';

export const getUserTickets = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_TICKETS_REQUEST,
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
			`/v3/tickets/usertickets?pageNo=${pageNo}`,
			config
		);

		dispatch({
			type: USER_TICKETS_SUCCESS,
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
			type: USER_TICKETS_FAIL,
			payload: message,
		});
	}
};

export const getTicketDetails = (ticketID) => async (dispatch, getState) => {
	try {
		dispatch({
			type: TICKET_DETAILS_REQUEST,
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
		const { data } = await axios.post(
			`/v3/tickets/${ticketID}`,
			{},
			config
		);

		dispatch({
			type: TICKET_DETAILS_SUCCESS,
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
			type: TICKET_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const getPublicTicketDetails = (ticketID) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: PUBLIC_TICKET_DETAILS_REQUEST,
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
		const { data } = await axios.get(`/v3/tickets/${ticketID}`, config);

		dispatch({
			type: PUBLIC_TICKET_DETAILS_SUCCESS,
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
			type: PUBLIC_TICKET_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const markTicketAsSeen = (ticketID) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PUBLIC_TICKET_DETAILS_REQUEST,
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
		const { data } = await axios.put(`/v3/tickets/${ticketID}`, {}, config);

		dispatch({
			type: PUBLIC_TICKET_DETAILS_SUCCESS,
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
			type: PUBLIC_TICKET_DETAILS_FAIL,
			payload: message,
		});
	}
};
