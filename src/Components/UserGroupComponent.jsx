import UserGroupList from './UserGroupSubComponents/UserGroupList';
import CreateUserGroup from './UserGroupSubComponents/CreateUserGroup';
import '../CSS/userGroupView.styl';

import { useState } from 'react';

import IconButton from '@mui/material/IconButton';
import GroupsIcon from '@mui/icons-material/Groups';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const UserGroupComponent = () => {
	const [openDialogue, setOpenDialogue] = useState(false);

	const handleClickOpenDialogue = () => {
		setOpenDialogue(true);
	};

	const handleCloseDialogue = () => {
		setOpenDialogue(false);
	};

	return (
		<>
			<h2 className='title'>Welcome!</h2>

			<div className='button'>
				<IconButton
					onClick={handleClickOpenDialogue}
					className='addUserGroup'
					color='secondary'>
					<GroupsIcon />
					<p className='buttonText'>Add New User Group</p>
				</IconButton>
			</div>
			<Dialog
				open={openDialogue}
				onClose={handleCloseDialogue}
				fullWidth={true}
				maxWidth={'lg'}>
				<DialogTitle>Create New User Group</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<nobr>
							<p className='regText'>
								Fill out the form below to create a new User Group.
							</p>
						</nobr>
					</DialogContentText>
					<CreateUserGroup />
				</DialogContent>
				<DialogActions>
					<IconButton onClick={handleCloseDialogue}>Cancel</IconButton>
				</DialogActions>
			</Dialog>
			<UserGroupList />
		</>
	);
};
export default UserGroupComponent;
