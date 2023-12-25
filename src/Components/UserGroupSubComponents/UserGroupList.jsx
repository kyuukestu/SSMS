import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ShowUserGroup from './ShowUserGroup';
import { v4 as uuidv4 } from 'uuid';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import PreviewIcon from '@mui/icons-material/Preview';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Diversity1Icon from '@mui/icons-material/Diversity1';

import { useNavigate } from 'react-router';

const UserGroupList = () => {
	const navigate = useNavigate();

	const cUserID = Cookies.get('cUserID');
	const [userGroups, setUserGroups] = useState([]);
	const [displayUserGroup, setDisplayUserGroup] = useState([]);

	const [open, setOpen] = useState(Array(userGroups.length).fill(false));

	const handleClick = (index, event) => {
		console.log(event.target.value);
		setOpen((prev) => {
			const newState = [...prev];
			newState[index] = !newState[index];
			return newState;
		});
	};

	useEffect(() => {
		async function getUserGroups() {
			try {
				const response = await axios.get(
					`http://localhost:5174/users/usersgroups/${cUserID}`
				);
				console.log('Response: ', response);

				const data = await response.data;
				console.log('Data:', data);
				setUserGroups(data);
			} catch (err) {
				console.error('Error', err);
			}
		}

		getUserGroups();
	}, [cUserID]);

	const deleteUserGroup = async (id) => {
		console.log(cUserID);
		console.log(id);

		let headersList = {
			'Content-Type': 'application/json',
		};

		let bodyContent = JSON.stringify({
			id: cUserID,
			usergroups: [
				{
					groupID: id,
				},
			],
		});

		let reqOptions = {
			url: 'http://localhost:5174/users/usersgroups',
			method: 'DELETE',
			headers: headersList,
			data: bodyContent,
		};

		let response = await axios.request(reqOptions);

		console.log(response.data);
		navigate(0);
	};

	const showUserGroup = async (id) => {
		setDisplayUserGroup([<ShowUserGroup groupID={id} key={uuidv4()} />]);
	};

	return (
		<main className='main'>
			<List
				className='ListScrollView'
				component='nav'
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						User Groups List
					</ListSubheader>
				}>
				{userGroups.map((group, index) => (
					<>
						<ListItemButton onClick={(e) => handleClick(index, e)}>
							<ListItemIcon>
								<Diversity1Icon />
							</ListItemIcon>
							<ListItemText primary={group.name} />
							{open ? <ExpandMore /> : <ExpandLess />}
						</ListItemButton>
						<Collapse in={open[index]} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								<ListItemButton sx={{ pl: 4 }}>
									<ListItemIcon>
										<PreviewIcon />
									</ListItemIcon>
									<ListItemText
										primary='Show UserGroup'
										onClick={() => showUserGroup(group.groupID)}
									/>
								</ListItemButton>
								<ListItemButton sx={{ pl: 4 }}>
									<ListItemIcon>
										<GroupRemoveIcon />
									</ListItemIcon>
									<ListItemText
										primary='Delete User Group'
										onClick={() => deleteUserGroup(group.groupID)}
									/>
								</ListItemButton>
							</List>
						</Collapse>
					</>
				))}
			</List>
			<h2 className='title'>Display User Group</h2>
			{displayUserGroup}
			{console.log('Display User Group: ', displayUserGroup)}
		</main>
	);
};
export default UserGroupList;
