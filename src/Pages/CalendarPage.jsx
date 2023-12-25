import NavAppBarComponent from '../Components/NavAppBarComponent';
import CalendarComponent from '../Components/CalendarComponent';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

const CalendarPage = () => {
	const session = useSession();

	const { isLoading } = useSessionContext();

	if (isLoading) {
		return (
			<>
				<p>Please Wait...</p>{' '}
			</>
		);
	}

	return (
		<>
			<NavAppBarComponent />
			{session ? (
				<CalendarComponent />
			) : (
				<Navigate to='/homePage' replace={true} /> // Redirect to home page if user is logged in
			)}
		</>
	);
};
export default CalendarPage;
