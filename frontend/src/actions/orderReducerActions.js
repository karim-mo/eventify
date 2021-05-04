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
} from '../types';
import axios from 'axios';

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
		dispatch({
			type: ORDER_CREATE_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
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
		dispatch({
			type: ORDER_DETAILS_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
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
		dispatch({
			type: ORDER_DETAILS_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
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
		dispatch({
			type: ORDER_PROMO_FAIL,
			payload:
				e.response && e.response.data.message
					? e.response.data.message
					: e.message,
		});
	}
};
