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

const userInfoInitialState = {
	user: {
		shippingAddresses: [],
		cart: [],
	},
	loading: false,
	isLogged: false,
};

export const userInfoReducer = (state = userInfoInitialState, action) => {
	switch (action.type) {
		case USER_LOGIN_REQUEST:
			return {
				isLogged: false,
				loading: true,
			};
		case USER_LOGIN_SUCCESS:
			return {
				loading: false,
				isLogged: true,
				user: action.payload,
			};
		case USER_LOGIN_FAIL:
			return {
				loading: false,
				isLogged: false,
				error: action.payload,
			};
		case USER_LOGIN_RESET:
			return {
				loading: false,
				isLogged: false,
			};
		case USER_REGISTRATION_REQUEST:
			return {
				isLogged: false,
				loading: true,
			};
		case USER_REGISTRATION_SUCCESS:
			return {
				loading: false,
				isLogged: true,
				user: action.payload,
			};
		case USER_REGISTRATION_FAIL:
			return {
				loading: false,
				isLogged: false,
				error: action.payload,
			};
		case USER_CART_REQUEST:
			return {
				...state,
				loading: true,
			};
		case USER_CART_SUCCESS:
			return {
				...state,
				loading: false,
				getCartSuccess: true,
				user: {
					...state.user,
					cart: action.payload.cart,
				},
			};
		case USER_CART_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case USER_CART_ADD_REQUEST:
			return {
				...state,
				loading: true,
			};
		case USER_CART_ADD_SUCCESS:
			return {
				...state,
				loading: false,
				getCartSuccess: null,
				addToCartSuccess: true,
				user: {
					...state.user,
					cart: action.payload.cart,
				},
			};
		case USER_CART_ADD_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case USER_CART_REMOVE_REQUEST:
			return {
				...state,
				loading: true,
			};
		case USER_CART_REMOVE_SUCCESS:
			return {
				...state,
				loading: false,
				getCartSuccess: null,
				addToCartSuccess: null,
				removeFromCartSuccess: true,
				user: {
					...state.user,
					cart: action.payload.cart,
				},
			};
		case USER_CART_REMOVE_FAIL:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		case USER_CART_RESET:
			return {
				...state,
				error: null,
				getCartSuccess: null,
				addToCartSuccess: null,
				removeFromCartSuccess: null,
			};

		default:
			return state;
	}
};
