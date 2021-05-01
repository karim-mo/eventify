import {
	USER_CONFIRMATION_REQUEST,
	USER_CONFIRMATION_RESET,
	USER_CONFIRMATION_SUCCESS,
	USER_CONFIRMATION_FAIL,
} from '../types';
import axios from 'axios';

export const sendUserConfirmation = (info) => async (dispatch) => {
	try {
		dispatch({
			type: USER_CONFIRMATION_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.put(
			'/eventifyapi/user/confirm',
			{
				email: info.email,
				password: info.password,
				name: info.name,
				country: info.country,
			},
			config
		);

		dispatch({
			type: USER_CONFIRMATION_SUCCESS,
			payload: data,
		});
	} catch (e) {
		dispatch({
			type: USER_CONFIRMATION_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};

export const reSendUserConfirmation = (email) => async (dispatch) => {
	try {
		dispatch({
			type: USER_CONFIRMATION_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'/eventifyapi/user/confirm',
			{
				email,
			},
			config
		);

		dispatch({
			type: USER_CONFIRMATION_SUCCESS,
			payload: data,
		});
	} catch (e) {
		dispatch({
			type: USER_CONFIRMATION_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};
