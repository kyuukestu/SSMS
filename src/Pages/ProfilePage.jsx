import NavAppBarComponent from '../Components/NavAppBarComponent';
import UserGroupComponent from '../Components/UserGroupComponent';

import { useSession, useSessionContext } from '@supabase/auth-helpers-react';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
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
				<main>
					<UserGroupComponent />
				</main>
			) : (
				<Navigate to='/homePage' replace={true} /> // Redirect to home page if user is logged in
			)}
		</>
	);
};
export default ProfilePage;
