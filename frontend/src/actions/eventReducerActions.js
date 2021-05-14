import axios from 'axios';
import {
	ADMIN_NEW_EVENT_FAIL,
	ADMIN_NEW_EVENT_REQUEST,
	ADMIN_NEW_EVENT_RESET,
	ADMIN_NEW_EVENT_SUCCESS,
	COMMENT_ADD_FAIL,
	COMMENT_ADD_REQUEST,
	COMMENT_ADD_SUCCESS,
	COMMENT_TOGGLE_HEART_FAIL,
	COMMENT_TOGGLE_HEART_REQUEST,
	COMMENT_TOGGLE_HEART_SUCCESS,
	EVENT_DETAILS_FAIL,
	EVENT_DETAILS_REQUEST,
	EVENT_DETAILS_SUCCESS,
	EVENT_LIST_FAIL,
	EVENT_LIST_REQUEST,
	EVENT_LIST_SUCCESS,
	USER_EVENTS_FAIL,
	USER_EVENTS_REQUEST,
	USER_EVENTS_SUCCESS,
} from '../types';
import { logoutUser } from './userReducerActions';

export const listEvents = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EVENT_LIST_REQUEST,
		});

		const {
			userInfo: { user },
		} = getState();

		if (user) {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};

			var { data } = await axios.get(`/v3/events?pageNo=${pageNo}`, config);
		} else {
			var { data } = await axios.get(`/v3/events?pageNo=${pageNo}`);
		}

		dispatch({
			type: EVENT_LIST_SUCCESS,
			payload: data,
		});
	} catch (e) {
		dispatch({
			type: EVENT_LIST_FAIL,
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};

export const getEventDetails = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EVENT_DETAILS_REQUEST,
		});
		const {
			userInfo: { user },
		} = getState();

		if (user) {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`,
				},
			};

			var { data } = await axios.get(`/v3/events/${id}`, config);
		} else {
			var { data } = await axios.get(`/v3/events/${id}`);
		}

		dispatch({
			type: EVENT_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		dispatch({
			type: EVENT_DETAILS_FAIL,
			payload: e.response && e.response.data.message ? e.response.data.message : e.message,
		});
	}
};

export const getUserHostedEvents = (pageNo) => async (dispatch, getState) => {
	try {
		dispatch({
			type: USER_EVENTS_REQUEST,
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

		const { data } = await axios.get(`/v3/events/userevents?pageNo=${pageNo}`, config);

		dispatch({
			type: USER_EVENTS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: USER_EVENTS_FAIL,
			payload: message,
		});
	}
};

export const addUserComment = (id, comment) => async (dispatch, getState) => {
	try {
		dispatch({
			type: COMMENT_ADD_REQUEST,
		});

		const {
			eventDetails: { event },
		} = getState();

		const {
			userInfo: { user },
		} = getState();

		const newComment = {
			_id: 'TEMP_ID',
			user: user.name,
			userID: user.id,
			comment,
			hearts: 0,
			heartedBy: [],
		};

		event.comments.push(newComment);

		dispatch({
			type: COMMENT_ADD_SUCCESS,
			payload: event,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		};

		const { data } = await axios.put(`/v3/events/${id}`, { comment }, config);

		dispatch({
			type: COMMENT_ADD_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: COMMENT_ADD_FAIL,
			payload: message,
		});
	}
};

export const toggleCommentHeart = (id, commentID) => async (dispatch, getState) => {
	try {
		dispatch({
			type: COMMENT_TOGGLE_HEART_REQUEST,
		});

		const {
			eventDetails: { event },
		} = getState();

		const {
			userInfo: { user },
		} = getState();

		const editedComment = event.comments.find(
			(comment) => comment._id.toString() === commentID.toString()
		);
		if (editedComment) {
			if (editedComment.heartedBy.find((_user) => _user.userID.toString() === user.id.toString())) {
				editedComment.heartedBy.forEach((_user, index) => {
					if (_user.userID.toString() === user.id.toString()) {
						editedComment.heartedBy.splice(index);
						editedComment.hearts -= 1;
					}
				});
			} else {
				editedComment.hearts += 1;
				const newHeartUser = {
					userID: user.id,
				};
				editedComment.heartedBy.push(newHeartUser);
			}
		}

		event.comments.map((comment) => {
			if (comment._id.toString() === commentID.toString()) {
				return editedComment;
			}
			return comment;
		});

		dispatch({
			type: COMMENT_TOGGLE_HEART_SUCCESS,
			payload: event,
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		};

		const { data } = await axios.post(`/v3/events/${id}`, { commentID }, config);

		dispatch({
			type: COMMENT_TOGGLE_HEART_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: COMMENT_TOGGLE_HEART_FAIL,
			payload: message,
		});
	}
};

export const deleteEvent = (eventID) => async (dispatch, getState) => {
	try {
		const {
			eventList: { events, pages },
		} = getState();

		const {
			userInfo: { user },
		} = getState();

		dispatch({
			type: EVENT_LIST_SUCCESS,
			payload: {
				pages: pages,
				events: events.filter((event) => event._id.toString() !== eventID.toString()),
			},
		});

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${user.token}`,
			},
		};

		await axios.delete(`/v3/events/${eventID}`, config);
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: EVENT_LIST_FAIL,
			payload: message,
		});
	}
};

export const editEventbyID = (event) => async (dispatch, getState) => {
	try {
		dispatch({
			type: EVENT_DETAILS_REQUEST,
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
			`/v3/events`,
			{
				eventID: event.eventID,
				name: event.name,
				image: event.image,
				description: event.description,
				category: event.category,
				ticketPrice: event.ticketPrice,
				availableTickets: event.availableTickets,
				eventCountry: event.eventCountry,
				endsOnYear: event.endsOnYear,
				endsOnMonth: event.endsOnMonth,
				endsOnDay: event.endsOnDay,
			},
			config
		);

		dispatch({
			type: EVENT_DETAILS_SUCCESS,
			payload: data,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: EVENT_DETAILS_FAIL,
			payload: message,
		});
	}
};

export const addNewEvent = (event) => async (dispatch, getState) => {
	try {
		dispatch({
			type: ADMIN_NEW_EVENT_REQUEST,
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
			`/v3/events`,
			{
				virtual: event.virtual,
				authorEmail: event.authorEmail,
				name: event.name,
				image: event.image,
				description: event.description,
				category: event.category,
				ticketPrice: event.ticketPrice,
				availableTickets: event.availableTickets,
				eventCountry: event.eventCountry,
				endsOnYear: event.endsOnYear,
				endsOnMonth: event.endsOnMonth,
				endsOnDay: event.endsOnDay,
			},
			config
		);

		dispatch({
			type: ADMIN_NEW_EVENT_SUCCESS,
			payload: data,
		});

		dispatch({
			type: ADMIN_NEW_EVENT_RESET,
		});
	} catch (e) {
		const message = e.response && e.response.data.message ? e.response.data.message : e.message;
		if (message === 'Not authorized, token failed' || message === 'Not authorized, no token') {
			dispatch(logoutUser());
		}
		dispatch({
			type: ADMIN_NEW_EVENT_FAIL,
			payload: message,
		});
	}
};
