import {
	useSession,
	useSupabaseClient,
	useSessionContext,
} from '@supabase/auth-helpers-react';

import CalendarListComponent from './CalendarSubComponents/CalendarListComponent';
import CreateCalendarComponent from './CalendarSubComponents/CreateCalendarComponent';
import '../CSS/calendarView.styl';

import { Navigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';

import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CalendarComponent = () => {
	const session = useSession(); //tokens, when session exists we have a user
	const supabase = useSupabaseClient(); //talks to supabase
	const { isLoading } = useSessionContext();

	const [openDialogue, setOpenDialogue] = useState(false);

	if (isLoading) {
		return (
			<>
				<p>Please Wait...</p>{' '}
			</>
		);
	}

	async function signOut() {
		await supabase.auth.signOut();
	}

	//Can remove later
	console.log(session);

	const handleClickOpenDialogue = () => {
		setOpenDialogue(true);
	};

	const handleCloseDialogue = () => {
		setOpenDialogue(false);
	};

	return (
		<div className='main'>
			{session ? (
				<>
					<h2 className='title'>Hello, {session.user.email}</h2>
					<div className='viewContainer'>
						<IconButton
							onClick={handleClickOpenDialogue}
							className='addEvent'
							color='secondary'>
							<CalendarMonthIcon />
							<p className='buttonText'>Add New Calendar</p>
						</IconButton>
						<Dialog
							open={openDialogue}
							onClose={handleCloseDialogue}
							fullWidth={true}
							maxWidth={'lg'}>
							<DialogTitle>Create New Googe Calendar</DialogTitle>
							<DialogContent>
								<DialogContentText>
									<nobr>
										<p className='regText'>
											Fill out the form below to create a new Google Calendar.
										</p>
									</nobr>
								</DialogContentText>
								<CreateCalendarComponent />
							</DialogContent>
							<DialogActions>
								<IconButton onClick={handleCloseDialogue}>Cancel</IconButton>
							</DialogActions>
						</Dialog>
					</div>
					{session.provider_token ? <CalendarListComponent /> : signOut()}
				</>
			) : (
				<Navigate to='/homePage' replace={true} /> // Redirect to home page if user is logged in
			)}
		</div>
	);
};

export default CalendarComponent;
