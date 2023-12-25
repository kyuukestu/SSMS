import { useEffect, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useSession } from '@supabase/auth-helpers-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const CalendarViewComponent = (props) => {
	const { calendarID } = props.calendarID;

	const session = useSession(); //tokens, when session exists we have a user

	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);

	console.log(session.provider_token);

	useEffect(() => {
		console.log('Events', events);
	}, [events]);

	useEffect(() => {
		const fetchCalendarEvents = async () => {
			try {
				const response = await fetch(
					`https://www.googleapis.com/calendar/v3/calendars/${props.calendarID}/events`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${session.provider_token}`,
							'Content-Type': 'application/json',
						},
					}
				);
				if (response.ok) {
					const calendarData = await response.json();
					const eventsData = calendarData.items.map((event) => ({
						id: event.id,
						title: event.summary,
						start: new Date(event.start.dateTime || event.start.date),
						end: new Date(event.end.dateTime || event.end.date),
					}));
					setEvents(eventsData);
					console.log('Calendar Data:', calendarData);
					console.log('Events Data:', eventsData);
					console.log('Events', events);
				} else {
					console.error(
						'Failed to fetch calendar events:',
						response.status,
						response.statusText
					);
				}
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		};

		fetchCalendarEvents();
	}, [props.calendarID, session.provider_token]);

	const localizer = momentLocalizer(moment);

	return (
		<div style={{ height: '500px' }}>
			{loading ? (
				<p>Loading...</p>
			) : (
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor='start'
					endAccessor='end'
					style={{ height: '500px' }}
				/>
			)}
		</div>
	);
};

export default CalendarViewComponent;
