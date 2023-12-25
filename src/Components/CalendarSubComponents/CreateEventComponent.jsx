import { useState } from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';

import { useSession } from '@supabase/auth-helpers-react';

import TextField from '@mui/material/TextField';

import '../../CSS/createEvent.styl';

const CreateEventComponent = (props) => {
	const { calendarID } = props;

	const session = useSession();

	const [start, setStart] = useState(dayjs());
	const [end, setEnd] = useState(dayjs());
	const [eventName, setEventName] = useState('');
	const [eventDescription, setEventDescription] = useState('');

	console.log('CalendarID from props', props.calendarID);

	async function createCalendarEvent() {
		console.log('Creating Calendar Event');
		const event = {
			summary: eventName,
			description: eventDescription,
			start: {
				dateTime: start.toISOString(),
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			},
			end: {
				dateTime: end.toISOString(),
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			},
		};
		await fetch(
			`https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
			{
				method: 'POST',
				headers: {
					Authorization: 'Bearer ' + session.provider_token, //access token for google ,
				},
				body: JSON.stringify(event),
			}
		)
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				console.log(data);
				alert('Event created, check your google Calendar.');
			});
	}

	return (
		<>
			<div className='textfields'>
				<input
					type='text'
					onChange={(e) => setEventName(e.target.value)}
					placeholder='Event Name'
				/>
				<TextField
					className='description'
					onChange={(e) => setEventDescription(e.target.value)}
					placeholder='Event Description'
					multiline
					rows={5}
				/>
				<hr />
			</div>
			<div className='pickers' style={{ display: 'flex' }}>
				<div className='startPicker'>
					<p className='text'>Start of your event:</p>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer components={['DateTimePicker']}>
							<StaticDateTimePicker
								label='Static date time picker'
								orientation='landscape'
								value={start}
								onChange={(newStart) => setStart(newStart)}
								className='dateTimePicker'
							/>
						</DemoContainer>
					</LocalizationProvider>
				</div>
				<div className='endPicker'>
					<p className='text'>End of your event:</p>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer components={['DateTimePicker']}>
							<StaticDateTimePicker
								label='Static date time picker'
								orientation='landscape'
								value={end}
								onChange={(newEnd) => setEnd(newEnd)}
								className='dateTimePicker'
							/>
						</DemoContainer>
					</LocalizationProvider>
				</div>
			</div>
			<button className='createButton' onClick={() => createCalendarEvent()}>
				Create Calendar Event
			</button>
		</>
	);
};

CreateEventComponent.propTypes = {
	calendarID: PropTypes.string.isRequired,
};

export default CreateEventComponent;
