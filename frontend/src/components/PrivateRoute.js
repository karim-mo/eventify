import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const userInfo = useSelector((state) => state.userInfo);
	const { isLogged } = userInfo;
	return (
		<Route
			{...rest}
			render={(props) =>
				!isLogged ? <Redirect to='/login' /> : <Component {...props} />
			}
		/>
	);
};

export default PrivateRoute;
