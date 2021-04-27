import HomeScreen from './views/HomeScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
	return (
		<Router>
			<Header />
			<main className='py-3'>
				<Route path='/' exact component={HomeScreen} />
			</main>
			<Footer />
		</Router>
	);
};

export default App;
