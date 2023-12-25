import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import NavAppBarComponent from '../Components/NavAppBarComponent';

import { useState } from 'react';

import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

import '../CSS/home.styl';

const HomePage = () => {
	const supabase = useSupabaseClient();
	const session = useSession();

	const [open, setOpen] = useState(false);

	const theme = useTheme();

	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	async function googleSignIn() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				scopes: 'https://www.googleapis.com/auth/calendar',
			},
		});

		if (error) {
			alert('Error logging in to Google provider with Supabase');
			console.log(error);
		}
	}

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<NavAppBarComponent />
			{session ? (
				<main className='intro'>
					<h2 className='title'>Hello, {session.user.email}</h2>
					<p className='text'>
						Welcome to the Student Social Management System!
					</p>
					<p className='text'>
						With this application you will be able to:
						<ul>
							<li>
								Create Social Groups with our User-Group functionality and add
								your friends!
							</li>
							<li>Manage Social Calendars via Google Calendars Integration</li>
							<li>
								Link User Groups & Calendars to keep your friends up to date!
							</li>
						</ul>
					</p>
				</main>
			) : (
				<main>
					<div className='button'>
						<Button variant='outlined' onClick={handleClickOpen}>
							Welcome to the SSMS App!
						</Button>
					</div>
					<Dialog
						fullScreen={fullScreen}
						open={open}
						onClose={handleClose}
						aria-labelledby='responsive-dialog-title'>
						<DialogTitle id='responsive-dialog-title'>
							{'Google Sign-in Required!'}
						</DialogTitle>
						<DialogContent>
							<DialogContentText>
								To make full use of this application, you must be signed into
								Google with a valid account!
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>Exit</Button>
							<Button onClick={googleSignIn}>Sign In</Button>
						</DialogActions>
					</Dialog>
				</main>
			)}
		</>
	);
};
export default HomePage;
