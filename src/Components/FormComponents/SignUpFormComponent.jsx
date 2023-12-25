import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../../CSS/SignUpForm.styl';

// Regular expression – Username must start with a lower or upper case letter; must be followed by one of the following: lower case, upper case, number, hyphen or underscore. Username can be between 3 and 23 characters
// Regular expression – Password requires at least one lower-case, one upper-case, one digit and one special character. Password can be between 8 and 24 characters.
const UserRegEx = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PwdRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;

const SignUpForm = () => {
	const userRef = useRef();
	const errRef = useRef();

	//Username Validation. Sets User, checks for valid Username, checks for whether focus is on User input field
	const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	//Password Validation. Sets Pwd, checks for valid Pwd, checks for whether focus is on Pwd input field
	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	//Match Validation. Sets Pwd match, checks for valid Pwd Match, checks for whether focus is on Pwd Match input field
	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	//Error Validation. Error message and successful submission
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	//Sets Focus to User on page load.
	useEffect(() => {
		userRef.current.focus();
	}, []);

	//Tests Username based on RegEx every time the username is changed
	useEffect(() => {
		const result = UserRegEx.test(user);
		console.log(result);
		console.log(user);
		setValidName(result);
	}, [user]);

	//Tests Password based on RegEx every time password is changed. Also checks for password match.
	useEffect(() => {
		const result = PwdRegEx.test(pwd);
		console.log(result);
		console.log(pwd);
		setValidPwd(result);
		const match = pwd === matchPwd;
		setValidMatch(match);
	}, [pwd, matchPwd]);

	//Changes Error message based on User input for the three fields
	useEffect(() => {
		setErrMsg('');
	}, [user, pwd, matchPwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// If Button is enable with JS hack
		const v1 = UserRegEx.test(user);
		const v2 = PwdRegEx.test(pwd);
		if (!v1 || !v2) {
			setErrMsg('Invalid Entry.');
			return;
		}
		try {
			const response = await axios.post(
				'http://localhost:5174/register',
				// name below has to match name on back-end otherwise specified as (backend-name: frontend-name)
				JSON.stringify({ user, pwd }),
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);
			console.log(response.data);
			console.log(JSON.stringify(response));
			setSuccess(true);
			setUser('');
			setPwd('');
		} catch (err) {
			if (!err?.response) {
				setErrMsg('No server response');
			} else if (err.response?.status === 409) {
				setErrMsg('Username Taken');
			} else {
				setErrMsg('Registration Failed');
			}
			errRef.current.focus();
		}
		console.log(user, pwd);
	};

	const reload = async () => {
		window.location.reload(true);
	};

	return (
		<>
			{success ? (
				<section>
					<h1>Success!</h1>
					<p>
						<a href='#'> Sign In</a>
					</p>
				</section>
			) : (
				<section>
					<p
						ref={errRef}
						className={errMsg ? 'errMsg' : 'offscreen'}
						aria-live='assertive'>
						{errMsg}
					</p>
					<h1>Sign Up</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor='username'>
							Username:
							<span className={validName ? 'valid' : 'hide'}>
								{/* Valid Icon */} Valid
							</span>
							<span className={validName || !user ? 'hide' : 'invalid'}>
								{/* Invalid Icon */} Invalid
							</span>
						</label>
						<input
							type='text'
							id='username'
							ref={userRef}
							autoComplete='off'
							onChange={(e) => setUser(e.target.value)}
							required
							aria-invalid={validName ? 'false' : 'true'}
							aria-describedby='uidnote'
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p
							id='uidnote'
							className={
								userFocus && user && !validName ? 'instructions' : 'offscreen'
							}>
							{/* info circle icon */} Info <br />
							4 to 24 characters. <br />
							Must begin with a letter. <br />
							Letters, numbers, underscores, hyphens allowed.
						</p>
						<label htmlFor='password'>
							Password:
							<span className={validPwd ? 'valid' : 'hide'}>
								{/* Valid Icon */}
							</span>
							<span className={validPwd || !pwd ? 'hide' : 'invalid'}>
								{/* {Invalid Icon} */}
							</span>
						</label>
						<input
							type='password'
							id='password'
							onChange={(e) => setPwd(e.target.value)}
							required
							aria-invalid={validPwd ? 'false' : 'true'}
							aria-describedby='pwdnote'
							onFocus={() => setPwdFocus(true)}
							onBlur={() => setPwdFocus(false)}
						/>
						<p
							id='pwdnote'
							className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
							{/* Info Icon */}
							8 to 24 character. <br />
							Must include uppercase and lowercase letters, a number and a
							special character. <br />
							Allowed special characters:
							<span aria-label='exclamation mark'>!</span>
							<span aria-label='at symbol'>@</span>
							<span aria-label='hashtag'>#</span>
							<span aria-label='dollar sign'>$</span>
							<span aria-label='percent'>%</span>
						</p>
						<label htmlFor='confirmPwd'>
							Confirm Password:
							<span className={validMatch && matchPwd ? 'valid' : 'hide'}>
								{/* valid icon */}
							</span>
							<span className={validMatch || !matchPwd ? 'hide' : 'invalid'}>
								{/* invalid icon */}
							</span>
						</label>
						<input
							type='password'
							id='confirmPwd'
							onChangeCapture={(e) => setMatchPwd(e.target.value)}
							required
							aria-invalid={validMatch ? 'false' : 'true'}
							aria-describedby='confirmnote'
							onFocus={() => setMatchFocus(true)}
							onBlur={() => setMatchFocus(false)}
						/>
						<p
							id='confirmnote'
							className={
								matchFocus && !validMatch ? 'instructions' : 'offscreen'
							}>
							{/* info icon */}
							Must match the first password input field.
						</p>
						<button
							type='submit'
							disabled={!!(!validName || !validPwd || !validMatch)}
							onClick={() => reload()}>
							Sign Up
						</button>
					</form>
				</section>
			)}
		</>
	);
};

export default SignUpForm;
