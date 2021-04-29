import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ variant, children }) => {
	return (
		<div>
			<Alert className='m-1' variant={variant}>
				{children}
			</Alert>
		</div>
	);
};

export default ErrorMessage;
