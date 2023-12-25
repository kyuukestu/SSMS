import { useState, useEffect } from 'react';
import CalendarViewComponent from './CalendarViewComponent';
import CreateEventComponent from './CreateEventComponent';

import { useSession } from '@supabase/auth-helpers-react';

import '../../CSS/calendarListView.styl';
import { v4 as uuidv4 } from 'uuid';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PreviewIcon from '@mui/icons-material/Preview';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import AddBoxIcon from '@mui/icons-material/AddBox';

import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate } from 'react-router';

const CalendarListComponent = () => {
	const [calendars, setCalendars] = useState([]);
	const [component, setComponent] = useState([]);
	const [idSelect, setIDSelect] = useState('');
	const [calendarName, setCalendarName] = useState('');

	const session = useSession();

	const [open, setOpen] = useState(Array(calendars.length).fill(false));
	const [openDialogue, setOpenDialogue] = useState(false);

	const navigate = useNavigate();

	const handleClick = (index, event) => {
		console.log(event.target.value);
		setOpen((prev) => {
			const newState = [...prev];
			newState[index] = !newState[index];
			return newState;
		});
	};

	const handleClickOpenDialogue = () => {
		setOpenDialogue(true);
	};

	const handleCloseDialogue = () => {
		setOpenDialogue(false);
	};

	const ComponentAdder = (id) => {
		setComponent([<CalendarViewComponent calendarID={id} key={uuidv4()} />]);
	};

	const deleteCalendar = async (id) => {
		await fetch(`https://www.googleapis.com/calendar/v3/calendars/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${session.provider_token}`,
				'Content-Type': 'application/json',
			},
		});

		alert('Calendar Deleted!');

		navigate(0);
	};

	useEffect(() => {
		async function getCalendarList() {
			try {
				const response = await fetch(
					'https://www.googleapis.com/calendar/v3/users/me/calendarList',
					{
						method: 'GET',
						headers: {
							Authorization: 'Bearer ' + session.provider_token, //access token for google ,
						},
					}
				);

				if (response.ok) {
					const data = await response.json();
					setCalendars(data.items);
				} else {
					console.error(
						'Failed to fetch Calendars, GGs:',
						response.status,
						response.statusText
					);
				}
			} catch (error) {
				console.error('Error fetching calendars, GGs:', error);
			}
		}

		getCalendarList();
	}, [session.provider_token]);

	console.log('Selected ID:', idSelect);
	console.log('Selected Calendar Name:', calendarName);

	return (
		<div className='main'>
			<List
				className='ListScrollView'
				component='nav'
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						Calendar List
					</ListSubheader>
				}>
				{calendars.map((calendar, index) => (
					<>
						<ListItemButton onClick={(e) => handleClick(index, e)}>
							<ListItemIcon>
								<CalendarTodayIcon />
							</ListItemIcon>
							<ListItemText primary={calendar.summary} />
							{open ? <ExpandMore /> : <ExpandLess />}
						</ListItemButton>
						<Collapse in={open[index]} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								<ListItemButton sx={{ pl: 4 }}>
									<ListItemIcon>
										<PreviewIcon />
									</ListItemIcon>
									<ListItemText
										primary='Show Calendar'
										onClick={() => ComponentAdder(calendar.id)}
									/>
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }}>
									<ListItemIcon>
										<EventAvailableIcon />
									</ListItemIcon>
									<ListItemText
										primary='Select Calendar'
										onClick={() => {
											setIDSelect(calendar.id);
											setCalendarName(calendar.summary);
										}}
									/>
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }}>
									<ListItemIcon>
										<EventBusyIcon />
									</ListItemIcon>
									<ListItemText
										primary='Delete Calendar'
										onClick={() => deleteCalendar(calendar.id)}
									/>
								</ListItemButton>
							</List>
						</Collapse>
					</>
				))}
			</List>
			<div className='eventAddViewContainer'>
				<IconButton
					onClick={handleClickOpenDialogue}
					className='addEvent'
					color='secondary'>
					<AddBoxIcon />
					<p className='buttonText'>Add Event</p>
				</IconButton>
				<Dialog
					open={openDialogue}
					onClose={handleCloseDialogue}
					fullWidth={true}
					maxWidth={'lg'}>
					<DialogTitle>Create Calendar Event</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<nobr>
								<p className='regText'>
									Fill out the form below to create a new event on the
									<p className='emphText'>{calendarName}</p>calender
								</p>
							</nobr>
						</DialogContentText>
						<CreateEventComponent calendarID={idSelect} />
					</DialogContent>
					<DialogActions>
						<IconButton onClick={handleCloseDialogue}>Cancel</IconButton>
					</DialogActions>
				</Dialog>
			</div>
			<div className='calendarDisplayContainer'>
				<h2 className='title'>Calendars Display</h2>
				{component}
			</div>
		</div>
	);
};

export default CalendarListComponent;
