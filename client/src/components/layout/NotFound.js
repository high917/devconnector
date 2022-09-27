import React from 'react';

const NotFound = () => {
	return (
		<div
			className='center-wrapper text-center'
			style={{ flexDirection: 'column' }}
		>
			<h1 className='x-large text-primary'>
				<i className='fas fa-exclamation-triangle' /> Page Not Found
			</h1>
			<p className='large'>Sorry This Page Does Not Exist</p>
		</div>
	);
};

export default NotFound;
