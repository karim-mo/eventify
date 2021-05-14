import { EMAIL_FAIL, EMAIL_REQUEST, EMAIL_RESET, EMAIL_SUCCESS } from '../types';

export const emailsReducer = (state = { loading: false }, action) => {
	switch (action.type) {
		case EMAIL_REQUEST:
			return { loading: true };
		case EMAIL_SUCCESS:
			return {
				loading: false,
				success: true,
			};
		case EMAIL_FAIL:
			return {
				loading: false,
				success: false,
				error: action.payload,
			};
		case EMAIL_RESET:
			return { loading: false };
		default:
			return state;
	}
};
