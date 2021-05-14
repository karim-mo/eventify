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
import PrivateRouteReverse from './components/PrivateRouteReverse';
import { useEffect } from 'react';
import Ticket from './views/Ticket';
import TicketerPage from './views/TicketerPage';
import AdminPage from './views/AdminPage';
import EditEvent from './views/EditEvent';
import AddEvent from './views/AddEvent';
import ForgotPassword from './views/ForgotPassword';
import ResetPassword from './views/ResetPassword';
import CreateEventTicket from './views/CreateEventTicket';
import Support from './views/Support';

const App = () => {
	return (
		<Router>
			<Header />
			<main className='py-3'>
				<Route path='/' exact component={HomeScreen} />
				<Route path='/events' component={EventScreen} exact />
				<Route path='/events/page/:pageNo' component={EventScreen} exact />
				<Route path='/event/details/:id' component={EventDetails} />
				<Route path='/login' component={Login} />
				<Route path='/register' component={Register} />
				<Route path='/cart' component={Cart} />
				<Route path='/confirmation/:id' component={Confirmation} />
				<Route path='/orders/:id' component={Order} />
				<PrivateRouteReverse path='/forgotpw' exact component={ForgotPassword} />
				<PrivateRouteReverse path='/resetpw/:id' exact component={ResetPassword} />
				<PrivateRoute path='/members/:name/profile' exact component={Profile} />
				<PrivateRoute path='/members/:name/profile/:key' exact component={Profile} />
				<PrivateRoute path='/members/:name/profile/:key/page/:pageNo' exact component={Profile} />
				<PrivateRoute path='/ticket/details/:id' exact component={Ticket} />
				<PrivateRoute path='/tickets/:id' exact component={TicketerPage} />
				<PrivateRoute path='/dashboard' exact component={AdminPage} />
				<PrivateRoute path='/dashboard/:key' exact component={AdminPage} />
				<PrivateRoute path='/dashboard/:key/page/:pageNo' exact component={AdminPage} />
				<PrivateRoute path='/dashboard/new/create-event' exact component={AddEvent} />
				<PrivateRoute path='/dashboard/editevent/:id' exact component={EditEvent} />
				<PrivateRoute path='/createEvent' exact component={CreateEventTicket} />
				<PrivateRoute path='/contactus' component={Support} />
			</main>
			<Footer />
		</Router>
	);
};

export default App;
