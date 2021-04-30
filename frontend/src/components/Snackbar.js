import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
	return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const customSnackbar = ({ open, variant, message }) => {
	return (
		<Snackbar
			open={open}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
			style={{ display: 'block' }}
		>
			<Alert severity={variant}>{message}</Alert>
		</Snackbar>
	);
};

export default customSnackbar;
