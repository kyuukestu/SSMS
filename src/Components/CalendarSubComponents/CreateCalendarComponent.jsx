import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

const CreateCalendarComponent = () => {
	const session = useSession();

	const [calendarName, setCalendarName] = useState('');

	async function createCalendar() {
		console.log('Creating new Calendar');
		const calendar = {
			summary: calendarName,
		};
		await fetch(`https://www.googleapis.com/calendar/v3/calendars`, {
			method: 'POST',
			headers: {
				Authorization: 'Bearer ' + session.provider_token, //access token for google ,
			},
			body: JSON.stringify(calendar),
		})
			.then((data) => {
				return data.json();
			})
			.then((data) => {
				console.log(data);
				alert('Calendar created!');
				window.location.reload(true);
			});
	}

	return (
		<div>
			<h2>Enter Calendar Name</h2>
			<input type='text' onChange={(e) => setCalendarName(e.target.value)} />
			<button onClick={() => createCalendar()}>Create Calendar</button>
		</div>
	);
};

export default CreateCalendarComponent;
