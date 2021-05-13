import {
	ADMIN_ORDERS_FAIL,
	ADMIN_ORDERS_REQUEST,
	ADMIN_ORDERS_SUCCESS,
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
		const { data } = await axios.put('/v3/orders/userorders', {}, config);
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

export const getOrderDetails_Capture =
	(orderID) => async (dispatch, getState) => {
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
				`/v3/orders/${orderID}/special`,
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

export const getOrderDetails_NoCapture =
	(orderID) => async (dispatch, getState) => {
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
				`/v3/orders/${orderID}/special`,
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

export const applyPromoCode =
	(orderID, promo) => async (dispatch, getState) => {
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
				`/v3/orders/${orderID}`,
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
			`/v3/orders/userorders?pageNo=${pageNo}`,
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

export const getAdminOrders = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ADMIN_ORDERS_REQUEST,
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
		const { data } = await axios.get(`/v3/orders?pageNo=${pageNo}`, config);

		dispatch({
			type: ADMIN_ORDERS_SUCCESS,
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
			type: ADMIN_ORDERS_FAIL,
			payload: message,
		});
	}
};

export const cancelOrder = (orderID) => async (dispatch, getState) => {
	try {
		const {
			adminOrders: { orders, pages },
		} = getState();

		const newOrders = {
			orders: orders.map((order) => {
				if (order._id.toString() === orderID.toString()) {
					order.paymentDetails.status = 'CANCELLED';
				}
				return order;
			}),
			pages: pages,
		};

		dispatch({
			type: ADMIN_ORDERS_SUCCESS,
			payload: newOrders,
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

		await axios.put(`/v3/orders/${orderID}`, {}, config);
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
			type: ADMIN_ORDERS_FAIL,
			payload: message,
		});
	}
};
