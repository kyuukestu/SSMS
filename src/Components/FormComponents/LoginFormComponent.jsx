import { useRef, useState, useEffect } from 'react';
// import AuthContext from '../Context/AuthProvider.jsx';
import axios from 'axios';
import useAuth from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LoginForm = () => {
	const { setAuth } = useAuth();

	const navigate = useNavigate();

	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');

	//Sets Focus to User on page load.
	useEffect(() => {
		userRef.current.focus();
	}, []);

	//Updates Error message whenever changes are made to the User or Pwd field.
	useEffect(() => {
		setErrMsg('');
	}, [user, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				'http://localhost:5174/auth',
				JSON.stringify({ user, pwd }),
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);

			const currentUser = await axios.get(
				`http://localhost:5174/users/User/${user}`
			);

			console.log(user, pwd);
			console.log(JSON.stringify(response?.data));
			// console.log(JSON.stringify(response));

			Cookies.set('cUserID', currentUser.data._id);
			Cookies.set('cUsername', currentUser.data.username);

			// console.log('Current User Data: ', currentUser.data);

			const accessToken = response?.data?.accessToken;
			const roles = response?.data?.roles;

			setAuth({ user, pwd, roles, accessToken });

			setUser('');
			setPwd('');
			navigate('/homePage');
		} catch (err) {
			if (!err?.response) {
				setErrMsg('No Server Response');
			} else if (err.response?.status === 400) {
				setErrMsg('Missing Username or Password');
				console.error('Login Failed: ', err);
			} else if (err.response?.status === 401) {
				setErrMsg('Unauthorized.');
				console.error('Login Failed: ', err);
			} else {
				setErrMsg('Login Failed.');
				console.error('Login Failed: ', err);
			}
			errRef.current.focus();
		}
	};

	return (
		<section>
			<p
				ref={errRef}
				className={errMsg ? 'errMsg' : 'offscreen'}
				aria-live='assertive'>
				{errMsg}
			</p>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor='username'>Username:</label>
				<input
					type='text'
					id='username'
					ref={userRef}
					autoComplete='off'
					onChange={(e) => setUser(e.target.value)}
					value={user}
					required
				/>
				<label htmlFor='password'>Password:</label>
				<input
					type='password'
					id='password'
					onChange={(e) => setPwd(e.target.value)}
					value={pwd}
					required
				/>

				<button type='submit'>Login</button>
			</form>
		</section>
	);
};

export default LoginForm;
