import {
	USER_LOGIN_FAIL,
	USER_LOGIN_REQUEST,
	USER_LOGIN_RESET,
	USER_LOGIN_SUCCESS,
	USER_REGISTRATION_FAIL,
	USER_REGISTRATION_REQUEST,
	USER_REGISTRATION_SUCCESS,
} from '../types';

const userInfoInitialState = {
	user: {
		shippingAddresses: [],
		cart: [],
	},
	loading: false,
};

export const userInfoReducer = (state = userInfoInitialState, action) => {
	switch (action.type) {
		case USER_LOGIN_REQUEST:
			return { loading: true };
		case USER_LOGIN_SUCCESS:
			return { loading: false, success: true, user: action.payload };
		case USER_LOGIN_FAIL:
			return { loading: false, success: false, error: action.payload };
		case USER_LOGIN_RESET:
			return { loading: false };
		case USER_REGISTRATION_REQUEST:
			return { loading: true };
		case USER_REGISTRATION_SUCCESS:
			return { loading: false, success: true, user: action.payload };
		case USER_REGISTRATION_FAIL:
			return { loading: false, success: false, error: action.payload };
		default:
			return state;
	}
};
