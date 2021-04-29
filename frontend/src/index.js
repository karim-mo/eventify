import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import App from './App';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
