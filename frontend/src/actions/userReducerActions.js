import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_RESET,
	USER_LOGIN_SUCCESS,
	USER_REGISTRATION_FAIL,
	USER_REGISTRATION_REQUEST,
	USER_REGISTRATION_SUCCESS,
} from '../types';
import axios from 'axios';

export const logoutUser = () => async (dispatch) => {
	dispatch({
		type: USER_LOGIN_RESET,
	});

	localStorage.removeItem('userInfo');
};

export const loginUser = (info) => async (dispatch) => {
	try {
		dispatch({
			type: USER_LOGIN_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.post(
			'/eventifyapi/user/auth',
			{
				email: info.email,
				password: info.password,
			},
			config
		);

		dispatch({
			type: USER_LOGIN_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (e) {
		dispatch({
			type: USER_LOGIN_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};

export const registerUser = (info) => async (dispatch) => {
	try {
		dispatch({
			type: USER_REGISTRATION_REQUEST,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		const { data } = await axios.put(
			'/eventifyapi/user/auth',
			{
				email: info.email,
				password: info.password,
				name: info.name,
				country: info.country,
			},
			config
		);

		dispatch({
			type: USER_REGISTRATION_SUCCESS,
			payload: data,
		});

		localStorage.setItem('userInfo', JSON.stringify(data));
	} catch (e) {
		dispatch({
			type: USER_REGISTRATION_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};
