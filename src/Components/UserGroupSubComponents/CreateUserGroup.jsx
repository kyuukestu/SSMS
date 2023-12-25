import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSession } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const CreateUserGroup = () => {
	const cUserID = Cookies.get('cUserID');
	const cUsername = Cookies.get('cUsername');

	const [name, setName] = useState('');
	const [calendarID, setCalendarID] = useState('');
	const [members, setMembers] = useState([]);
	const [member, setMember] = useState([]);
	const [calendarList, setCalendarList] = useState([]);
	const [users, setUsers] = useState([]);

	const session = useSession();

	const [personName, setPersonName] = useState([]);

	const handleChangeList = (event) => {
		const {
			target: { value },
		} = event;

		setPersonName(
			// On autofill we get a stringified value.
			typeof value === 'string' ? value.split(',') : value
		);

		setMember(personName);
	};

	const handleChange = (event) => {
		setCalendarID(event.target.value);
	};

	let memberName = [];
	let memberID = [];
	let membersArr = [];

	const handleMembers = () => {
		const getMembers = async (name) => {
			const member = await axios.get(
				`http://localhost:5174/users/User/${name}`
			);

			memberName.push(member.data.username);
			memberID.push(member.data._id);

			const memberObj = {
				name: member.data.username,
				userID: member.data._id,
			};

			membersArr.push(memberObj);

			setMember(membersArr);
			setMembers(member);
		};

		console.log('Creating new User Group');

		const data = users;

		for (const element of data) {
			getMembers(element);
		}

		console.log('Members: ', members);
		console.log('Member: ', member);
		console.log('Members Array: ', membersArr);
		console.log('Member Names: ', memberName);
		console.log('Member IDs: ', memberID);

		setMembers(membersArr);
	};

	const createUserGroup = async (e) => {
		e.preventDefault();

		handleMembers();

		try {
			let headersList = {
				Accept: '*/*',
				'Content-Type': 'application/json',
			};

			let bodyContent = JSON.stringify({
				name,
				calendarID,
				members: member,
			});

			let reqOptions = {
				url: 'http://localhost:5174/usergroups',
				method: 'POST',
				headers: headersList,
				data: bodyContent,
			};

			let response = await axios.request(reqOptions);

			console.log('Create User Group Reponse: ', response.data);

			setName('');
			setCalendarID('');
			setMembers([]);

			addSelftoGroup(response.data._id);
			addGrouptoSelf(response.data._id);

			window.location.reload(true); // Refreshes the page
		} catch (err) {
			console.error('Error: ', err);
		}
	};

	const addSelftoGroup = async (id) => {
		let headersList = {
			Accept: '*/*',
			'Content-Type': 'application/json',
		};

		let bodyContent = JSON.stringify({
			id: id,
			members: [{ name: `${cUsername}`, userID: `${cUserID}` }],
		});

		let reqOptions = {
			url: 'http://localhost:5174/usergroups/members/',
			method: 'PUT',
			headers: headersList,
			data: bodyContent,
		};

		let response = await axios.request(reqOptions);

		console.log('Add Self to Group Reponse: ', response.data);
	};

	const addGrouptoSelf = async (id) => {
		let headersList = {
			Accept: '*/*',
			'Content-Type': 'application/json',
		};

		let bodyContent = JSON.stringify({
			id: cUserID,
			usergroups: [
				{
					name: name,
					groupID: id,
				},
			],
		});

		let reqOptions = {
			url: 'http://localhost:5174/users/usersgroups',
			method: 'POST',
			headers: headersList,
			data: bodyContent,
		};

		let response = await axios.request(reqOptions);
		console.log('Add Group to Self Response: ', response.data);
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
					setCalendarList(data.items);
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

		const getAllUsers = async () => {
			const allUsers = await axios.get('http://localhost:5174/users');

			console.log('All Users: ', allUsers.data);

			const usernames = allUsers.data.map((user) => user.username);
			console.log('Usernames: ', usernames);

			setUsers(usernames);
		};

		getAllUsers();
		getCalendarList();
	}, [session.provider_token]);

	return (
		<>
			<h2>Create a New User Group?</h2>
			<form onSubmit={createUserGroup}>
				<label htmlFor='name'>Name:</label>
				<input
					type='text'
					id='name'
					name='name'
					onChange={(e) => setName(e.target.value)}
				/>
				<label htmlFor='calendarID' id='calendarIDLabel'>
					Calendar ID:
				</label>
				<FormControl sx={{ m: 1, minWidth: 120 }}>
					<InputLabel id='calendarID'>Calendar(s)</InputLabel>
					<Select
						labelId='calendarIDLabe'
						id='calendarID-select'
						value={calendarID}
						label='Calendar'
						onChange={handleChange}>
						<MenuItem value=''>
							<em>None</em>
						</MenuItem>
						{calendarList.map((calendar, index) => (
							<MenuItem key={uuidv4()} value={calendar.id}>
								<div className='indexNum'>{index + 1}</div>
								<div>{calendar.summary}</div>
							</MenuItem>
						))}
					</Select>
					<FormHelperText>
						Select Calendar from the List provided.
					</FormHelperText>
				</FormControl>

				<label htmlFor='members' id='membersLabel'>
					Members:
				</label>
				<FormControl sx={{ m: 1, width: 300 }}>
					<InputLabel id='members'>Select Members</InputLabel>
					<Select
						labelId='membersLabel'
						id='members-multiple-checkbox'
						multiple
						value={personName}
						onChange={handleChangeList}
						input={<OutlinedInput label='Tag' />}
						renderValue={(selected) => selected.join(', ')}
						MenuProps={MenuProps}>
						{users.map((name) => (
							<MenuItem key={name} value={name}>
								<Checkbox checked={personName.indexOf(name) > -1} />
								<ListItemText primary={name} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<button type='submit'>Create</button>
			</form>
		</>
	);
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export default CreateUserGroup;
