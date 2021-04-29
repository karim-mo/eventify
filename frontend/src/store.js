import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
	eventListReducer,
	eventDetailsReducer,
} from './reducers/eventsReducer';
import { userInfoReducer } from './reducers/userReducer';

const reducer = combineReducers({
	eventList: eventListReducer,
	eventDetails: eventDetailsReducer,
	userInfo: userInfoReducer,
});

const getUserInfo = () => {
	return localStorage.getItem('userInfo')
		? JSON.parse(localStorage.getItem('userInfo'))
		: null;
};

const initalState = { userInfo: { user: getUserInfo() } };

const store = createStore(
	reducer,
	initalState,
	composeWithDevTools(applyMiddleware(thunk))
);

export default store;

// Store -> Reducer -> Actions -> Dev
