import {
	USER_CONFIRMATION_REQUEST,
	USER_CONFIRMATION_RESET,
	USER_CONFIRMATION_SUCCESS,
	USER_CONFIRMATION_FAIL,
	PASSWORD_RESET_REQUEST,
	PASSWORD_RESET_SUCCESS,
	PASSWORD_RESET_FAIL,
	PASSWORD_RESET_RESET,
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
			'/v3/user/confirm',
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
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
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
			'/v3/user/confirm',
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
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};

export const resetPassword_P1 = (email) => async (dispatch) => {
	try {
		dispatch({
			type: PASSWORD_RESET_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.post(
			'/v3/user/userpassword',
			{
				email,
			},
			config
		);

		dispatch({
			type: PASSWORD_RESET_SUCCESS,
		});

		dispatch({
			type: PASSWORD_RESET_RESET,
		});
	} catch (e) {
		dispatch({
			type: PASSWORD_RESET_FAIL,
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};

export const resetPassword_P2 = (info) => async (dispatch) => {
	try {
		dispatch({
			type: PASSWORD_RESET_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		await axios.put(
			'/v3/user/userpassword',
			{
				...info,
			},
			config
		);

		dispatch({
			type: PASSWORD_RESET_SUCCESS,
		});

		dispatch({
			type: PASSWORD_RESET_RESET,
		});
	} catch (e) {
		dispatch({
			type: PASSWORD_RESET_FAIL,
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};
