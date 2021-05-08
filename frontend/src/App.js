import HomeScreen from './views/HomeScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import EventScreen from './views/EventScreen';
import EventDetails from './views/EventDetails';
import Login from './views/Login';
import Register from './views/Register';
import Cart from './views/Cart';
import Confirmation from './views/Confirmation';
import Order from './views/Order';
import Profile from './views/Profile';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';

const App = () => {
	return (
		<Router>
			<Header />
			<main className='py-3'>
				<Route path='/' exact component={HomeScreen} />
				<Route path='/events' component={EventScreen} exact />
				<Route
					path='/events/page/:pageNo'
					component={EventScreen}
					exact
				/>
				<Route path='/event/details/:id' component={EventDetails} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='/cart' component={Cart} />
				<Route path='/confirmation/:id' component={Confirmation} />
				<Route path='/orders/:id' component={Order} />
				<PrivateRoute
					path='/members/:name/profile'
					exact
					component={Profile}
				/>
				<PrivateRoute
					path='/members/:name/profile/:key'
					exact
					component={Profile}
				/>
				<PrivateRoute
					path='/members/:name/profile/:key/page/:pageNo'
					exact
					component={Profile}
				/>
			</main>
			<Footer />
		</Router>
	);
};

export default App;
