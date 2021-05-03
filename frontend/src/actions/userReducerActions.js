import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_RESET,
	USER_LOGIN_SUCCESS,
	USER_REGISTRATION_FAIL,
	USER_REGISTRATION_REQUEST,
	USER_REGISTRATION_SUCCESS,
	USER_CART_ADD_FAIL,
	USER_CART_ADD_SUCCESS,
	USER_CART_ADD_REQUEST,
	USER_CART_FAIL,
	USER_CART_REMOVE_FAIL,
	USER_CART_REMOVE_REQUEST,
	USER_CART_REMOVE_SUCCESS,
	USER_CART_REQUEST,
	USER_CART_SUCCESS,
	USER_CART_RESET,
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

export const registerUser = (confirmationURL) => async (dispatch) => {
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
				confirmationURL,
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

export const getCart = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_CART_REQUEST,
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

		const { data } = await axios.get('/eventifyapi/cart', config);

		dispatch({
			type: USER_CART_SUCCESS,
			payload: data,
		});

		dispatch({
			type: USER_CART_RESET,
		});

		localStorage.setItem(
			'userInfo',
			JSON.stringify({
				...user,
				cart: data.cart,
			})
		);
	} catch (e) {
		dispatch({
			type: USER_CART_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};

export const addToCart = (eventID) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_CART_ADD_REQUEST,
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

		const { data } = await axios.put(
			'/eventifyapi/cart',
			{
				eventID: eventID,
			},
			config
		);

		dispatch({
			type: USER_CART_ADD_SUCCESS,
			payload: data,
		});

		localStorage.setItem(
			'userInfo',
			JSON.stringify({
				...user,
				cart: data.cart,
			})
		);

		dispatch({
			type: USER_CART_RESET,
		});
	} catch (e) {
		dispatch({
			type: USER_CART_ADD_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};

export const removeFromCart = (eventID) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_CART_REMOVE_REQUEST,
		});

		const {
			userInfo: { user },
		} = getState();

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
			data: {
				eventID: eventID,
			},
		};

		const { data } = await axios.delete('/eventifyapi/cart', config);

		dispatch({
			type: USER_CART_REMOVE_SUCCESS,
			payload: data,
		});

		localStorage.setItem(
			'userInfo',
			JSON.stringify({
				...user,
				cart: data.cart,
			})
		);

		dispatch({
			type: USER_CART_RESET,
		});
	} catch (e) {
		dispatch({
			type: USER_CART_REMOVE_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};
