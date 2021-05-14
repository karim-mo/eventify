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

export const userConfirmationReducer = (state = { loading: false }, action) => {
	switch (action.type) {
		case USER_CONFIRMATION_REQUEST:
			return { ...state, loading: true };
		case USER_CONFIRMATION_SUCCESS:
			return {
				loading: false,
				awaitingConfirmation: action.payload.awaitingConfirmation
					? action.payload.awaitingConfirmation
					: null,
				reSend: action.payload.reSend ? action.payload.reSend : null,
				email: action.payload.email ? action.payload.email : null,
			};
		case USER_CONFIRMATION_FAIL:
			return { loading: false, error: action.payload };
		case USER_CONFIRMATION_RESET:
			return { loading: false };
		default:
			return state;
	}
};

export const userResetPasswordReducer = (state = { loading: false }, action) => {
	switch (action.type) {
		case PASSWORD_RESET_REQUEST:
			return { loading: true };
		case PASSWORD_RESET_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case PASSWORD_RESET_FAIL:
			return {
				loading: false,
				success: false,
				error: action.payload,
			};
		case PASSWORD_RESET_RESET:
			return { loading: false };
		default:
			return state;
	}
};
