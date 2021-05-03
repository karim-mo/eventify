import HomeScreen from './views/HomeScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import EventScreen from './views/EventScreen';
import EventDetails from './views/EventDetails';
import Login from './views/Login';
import Register from './views/Register';
import Cart from './views/Cart';
import Confirmation from './views/Confirmation';
import Order from './views/Order';

const App = () => {
	return (
		<Router>
			<Header />
			<main className='py-3'>
				<Route path='/' exact component={HomeScreen} />
				<Route path='/events' component={EventScreen} />
				<Route path='/event/details/:id' component={EventDetails} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='/cart' component={Cart} />
				<Route path='/confirmation/:id' component={Confirmation} />
				<Route path='/orders/:id' component={Order} />
			</main>
			<Footer />
		</Router>
	);
};

export default App;
