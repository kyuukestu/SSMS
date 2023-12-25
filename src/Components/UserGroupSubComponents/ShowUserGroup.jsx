import axios from 'axios';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import AbcIcon from '@mui/icons-material/Abc';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupIcon from '@mui/icons-material/Group';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const ShowUserGroup = ({ groupID }) => {
	const [userGroup, setUserGroup] = useState([]);
	const [members, setMembers] = useState([]);

	const [open, setOpen] = useState(true);

	const handleClick = () => {
		setOpen(!open);
	};

	useEffect(() => {
		const getUserGroup = async () => {
			console.log('Group ID: ', groupID);

			let headersList = {
				Accept: '*/*',
			};

			let reqOptions = {
				url: `http://localhost:5174/usergroups/${groupID}`,
				method: 'GET',
				headers: headersList,
			};

			let response = await axios.request(reqOptions);

			console.log('Get User Group Response: ', response.data);

			setUserGroup(response.data);
			setMembers(response.data.members);
		};

		getUserGroup();
	}, [groupID]);

	return (
		<List
			className='ListScrollView'
			component='nav'
			aria-labelledby='nested-list-subheader'
			subheader={
				<ListSubheader component='div' id='nested-list-subheader'>
					User Group
				</ListSubheader>
			}>
			<ListItemButton>
				<ListItemIcon>
					<AbcIcon />
				</ListItemIcon>
				<ListItemText primary={userGroup.name} />
			</ListItemButton>
			<ListItemButton>
				<ListItemIcon>
					<CalendarMonthIcon />
				</ListItemIcon>
				<ListItemText primary={userGroup.calendarID} />
			</ListItemButton>
			<ListItemButton onClick={handleClick}>
				<ListItemIcon>
					<GroupIcon />
				</ListItemIcon>
				<ListItemText primary='Members' />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			<Collapse in={open} timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					{members.map((group) => (
						<ListItemButton key={uuidv4()} sx={{ pl: 4 }}>
							<ListItemIcon>
								<PersonIcon />
							</ListItemIcon>
							<ListItemText primary={group.name} />
						</ListItemButton>
					))}
				</List>
			</Collapse>
		</List>
	);
};

ShowUserGroup.propTypes = {
	groupID: PropTypes.string.isRequired,
};

export default ShowUserGroup;
