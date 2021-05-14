import { EMAIL_FAIL, EMAIL_REQUEST, EMAIL_RESET, EMAIL_SUCCESS } from '../types';
import axios from 'axios';

export const sendEventTicket = (info) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EMAIL_REQUEST,
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

		await axios.post(
			'/v3/user/emails',
			{
				...info,
			},
			config
		);

		dispatch({
			type: EMAIL_SUCCESS,
		});

		dispatch({
			type: EMAIL_RESET,
		});
	} catch (e) {
		dispatch({
			type: EMAIL_FAIL,
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};

export const sendSupportTicket = (info) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EMAIL_REQUEST,
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

		await axios.put(
			'/v3/user/emails',
			{
				...info,
			},
			config
		);

		dispatch({
			type: EMAIL_SUCCESS,
		});

		dispatch({
			type: EMAIL_RESET,
		});
	} catch (e) {
		dispatch({
			type: EMAIL_FAIL,
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};
