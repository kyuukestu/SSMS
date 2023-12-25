import LoginSignUpPage from './Pages/LoginSignUpPage';
import LayoutComponent from './Components/LayoutComponent';
import HomePage from './Pages/HomePage';
import ProfilePage from './Pages/ProfilePage';
import MissingPage from './Pages/MissingPage';
import { Routes, Route } from 'react-router-dom';
import CalendarPage from './Pages/CalendarPage';
import UnauthorizedPage from './Pages/UnauthorizedPage';

function App() {
	return (
		<Routes>
			<Route path='/' element={<LayoutComponent />}>
				{/* <Route path='/' element={<CalendarPage />}> */}
				{/* <Route path='/' element={<LoginSignUpPage />}> */}

				{/* Public Routes */}
				<Route path='/' element={<LoginSignUpPage />} />
				<Route path='unauthorizedPage' element={<UnauthorizedPage />} />
				<Route path='/#' element={<HomePage />} />

				{/* Protected Routes */}
				{/* <Route element={<RequireAuth allowedRoles={[]} />}> */}
				<Route path='/homePage' element={<HomePage />} />
				<Route path='/calendarPage' element={<CalendarPage />} />
				<Route path='/profilePage' exact element={<ProfilePage />} />
				{/* </Route> */}

				{/* Catch All */}
				<Route path='*' element={<MissingPage />} />
			</Route>
		</Routes>
	);
}

export default App;
