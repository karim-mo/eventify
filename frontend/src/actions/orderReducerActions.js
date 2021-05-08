import {
	ORDER_CREATE_FAIL,
	ORDER_CREATE_REQUEST,
	ORDER_CREATE_RESET,
	ORDER_CREATE_SUCCESS,
	ORDER_DETAILS_FAIL,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_PROMO_FAIL,
	ORDER_PROMO_REQUEST,
	ORDER_PROMO_SUCCESS,
	USER_ORDERS_FAIL,
	USER_ORDERS_REQUEST,
	USER_ORDERS_SUCCESS,
} from '../types';
import axios from 'axios';
import { logoutUser } from './userReducerActions';

export const createOrderFromCart = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: ORDER_CREATE_REQUEST,
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
			'/eventifyapi/orders/userorders',
			{},
			config
		);
		if (data.message) {
			throw new Error(data.message);
		}

		dispatch({
			type: ORDER_CREATE_SUCCESS,
			payload: data,
		});

		dispatch({
			type: ORDER_CREATE_RESET,
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
			type: ORDER_CREATE_FAIL,
			payload: message,
		});
	}
};

export const getOrderDetails_Capture = (orderID) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: ORDER_DETAILS_REQUEST,
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
			`/eventifyapi/orders/${orderID}/special`,
			{ capture: true },
			config
		);

		if (data.message) {
			throw new Error(data.message);
		}

		dispatch({
			type: ORDER_DETAILS_SUCCESS,
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
			type: ORDER_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const getOrderDetails_NoCapture = (orderID) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: ORDER_DETAILS_REQUEST,
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
			`/eventifyapi/orders/${orderID}/special`,
			{},
			config
		);

		if (data.message) {
			throw new Error(data.message);
		}

		dispatch({
			type: ORDER_DETAILS_SUCCESS,
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
			type: ORDER_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const applyPromoCode = (orderID, promo) => async (
	dispatch,
	getState
) => {
	try {
		dispatch({
			type: ORDER_PROMO_REQUEST,
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
			`/eventifyapi/orders/${orderID}`,
			{ promo },
			config
		);

		if (data.message) {
			throw new Error(data.message);
		}

		dispatch({
			type: ORDER_PROMO_SUCCESS,
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
			type: ORDER_PROMO_FAIL,
			payload: message,
		});
	}
};

export const getUserOrders = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_ORDERS_REQUEST,
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
			`/eventifyapi/orders/userorders?pageNo=${pageNo}`,
			config
		);

		dispatch({
			type: USER_ORDERS_SUCCESS,
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
			type: USER_ORDERS_FAIL,
			payload: message,
		});
	}
};
