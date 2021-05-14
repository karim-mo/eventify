import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const PrivateRouteReverse = ({ component: Component, ...rest }) => {
	const userInfo = useSelector((state) => state.userInfo);
	const { isLogged } = userInfo;
	return (
		<Route {...rest} render={(props) => (isLogged ? <Redirect to='/' /> : <Component {...props} />)} />
	);
};

export default PrivateRouteReverse;
