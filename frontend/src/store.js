import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
	eventListReducer,
	eventDetailsReducer,
	userEventsReducer,
} from './reducers/eventsReducer';
import { userInfoReducer } from './reducers/userReducer';
import { userConfirmationReducer } from './reducers/confirmationReducer';
import {
	orderDetailsReducer,
	ordersReducer,
	userOrdersReducer,
} from './reducers/ordersReducer';

const reducer = combineReducers({
	eventList: eventListReducer,
	eventDetails: eventDetailsReducer,
	userInfo: userInfoReducer,
	userConfirmation: userConfirmationReducer,
	ordersInfo: ordersReducer,
	orderDetails: orderDetailsReducer,
	userOrders: userOrdersReducer,
	userEvents: userEventsReducer,
});

const getUserInfo = () => {
	return localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo'))
		: null;
};

const initalState = {
	userInfo: { user: getUserInfo(), isLogged: getUserInfo() ? true : false },
};

const store = createStore(
	reducer,
	initalState,
	composeWithDevTools(applyMiddleware(thunk))
);

export default store;

// Store -> Reducer -> Actions -> Dev
