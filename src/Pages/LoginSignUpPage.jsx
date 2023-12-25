import * as React from 'react';

import LoginFormComponent from '../Components/FormComponents/LoginFormComponent';
import SignUpFormComponent from '../Components/FormComponents/SignUpFormComponent';

const LoginSignUpPage = () => {
	return (
		<div className='container'>
			<div className='row'>
				<div className='col-6'>
					<LoginFormComponent />
				</div>
				<div className='col-6'>
					<SignUpFormComponent />
				</div>
			</div>
		</div>
	);
};
export default LoginSignUpPage;
