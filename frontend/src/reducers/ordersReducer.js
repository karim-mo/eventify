import {
	ORDER_CREATE_FAIL,
	ORDER_CREATE_REQUEST,
	ORDER_CREATE_RESET,
	ORDER_CREATE_SUCCESS,
	ORDER_DETAILS_FAIL,
	ORDER_DETAILS_REQUEST,
	ORDER_DETAILS_SUCCESS,
	ORDER_PROMO_FAIL,
	ORDER_PROMO_SUCCESS,
	ORDER_PROMO_REQUEST,
} from '../types';

export const ordersReducer = (state = { loading: false }, action) => {
	switch (action.type) {
		case ORDER_CREATE_REQUEST:
			return { loading: true };
		case ORDER_CREATE_SUCCESS:
			return {
				loading: false,
				created: true,
				createdOrder: action.payload,
			};
		case ORDER_CREATE_FAIL:
			return {
				loading: false,
				created: false,
				error: action.payload,
			};
		case ORDER_CREATE_RESET:
			return { loading: false };
		default:
			return state;
	}
};

export const orderDetailsReducer = (
	state = {
		order: {
			orderItems: [],
			paymentDetails: {},
		},
		loading: true,
	},
	action
) => {
	switch (action.type) {
		case ORDER_DETAILS_REQUEST:
			return { loading: true };
		case ORDER_DETAILS_SUCCESS:
			return {
				loading: false,
				fetched: true,
				order: action.payload,
			};
		case ORDER_DETAILS_FAIL:
			return {
				loading: false,
				fetched: false,
				error: action.payload,
			};
		case ORDER_PROMO_REQUEST:
			return { ...state, loading: true };
		case ORDER_PROMO_SUCCESS:
			return {
				loading: false,
				fetched: true,
				order: action.payload,
			};
		case ORDER_PROMO_FAIL:
			return {
				...state,
				loading: false,
				fetched: false,
				error: action.payload,
			};
		case 'ORDER_ERROR_RESET':
			return {
				...state,
				error: null,
			};
		default:
			return state;
	}
};
