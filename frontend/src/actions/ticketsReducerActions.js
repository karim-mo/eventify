import {
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
