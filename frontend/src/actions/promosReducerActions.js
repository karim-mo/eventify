import { ADMIN_PROMOS_FAIL, ADMIN_PROMOS_REQUEST, ADMIN_PROMOS_SUCCESS } from '../types';
import { logoutUser } from './userReducerActions';
import axios from 'axios';

export const getAdminPromos = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ADMIN_PROMOS_REQUEST,
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
		const { data } = await axios.get(`/v3/promos?pageNo=${pageNo}`, config);

		dispatch({
			type: ADMIN_PROMOS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: ADMIN_PROMOS_FAIL,
			payload: message,
		});
	}
};

export const deletePromo = (promoID) => async (dispatch, getState) => {
	try {
		const {
			adminPromos: { promos, pages },
		} = getState();

		const {
			userInfo: { user },
		} = getState();

		dispatch({
			type: ADMIN_PROMOS_SUCCESS,
			payload: {
				pages: pages,
				promos: promos.filter((promo) => promo._id.toString() !== promoID.toString()),
			},
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		};

		await axios.delete(`/v3/promos/${promoID}`, config);
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: ADMIN_PROMOS_FAIL,
			payload: message,
		});
	}
};

export const createPromo = (promo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ADMIN_PROMOS_REQUEST,
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
			`/v3/promos`,
			{
				...promo,
			},
			config
		);
		const { data } = await axios.get('/v3/promos?pageNo=1', config);

		dispatch({
			type: ADMIN_PROMOS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: ADMIN_PROMOS_FAIL,
			payload: message,
		});
	}
};
