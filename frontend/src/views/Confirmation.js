import React, { useEffect, useState } from 'react';
import Snackbar from '../components/Snackbar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../actions/userReducerActions';
import Meta from '../components/Meta';

const Confirmation = ({ match, history }) => {
	const userInfo = useSelector((state) => state.userInfo);
	const { isLogged, error } = userInfo;

	const dispatch = useDispatch();

	const [regOpen, setRegOpen] = useState(true);
	const [doneOpen, setDoneOpen] = useState(false);

	useEffect(() => {
		if (!isLogged && match.params.id) {
			setRegOpen(true);
			setDoneOpen(false);
			dispatch(registerUser(match.params.id));
		} else {
			setRegOpen(false);
			setDoneOpen(true);
			setTimeout(() => history.push('/'), 5000);
		}
	}, [dispatch, history, match, isLogged]);

	useEffect(() => {
		if (error) {
			setRegOpen(false);
			setDoneOpen(true);
			setTimeout(() => history.push('/'), 5000);
		}
	}, [error, history]);

	return (
		<>
			<Meta title='Eventify | Email Confirmation' />
			<Container>
				{regOpen && (
					<Snackbar
						open={regOpen}
						variant='info'
						message={`Finalizing Registration & Logging in...`}
					/>
				)}
				{doneOpen && <Snackbar open={doneOpen} variant='warning' message='Redirecting..' />}
				<Row className='justify-content-md-center'>
					<Col xs={12} md={6}>
						{error ? <ErrorMessage variant='danger'>{error}</ErrorMessage> : <Loading />}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Confirmation;
