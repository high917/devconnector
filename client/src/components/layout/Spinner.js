import React from 'react';
import spinner from './spinner.gif';

export default () => (
	<div className='center-wrapper'>
		<img className='spinner-img' src={spinner} alt='Loading...' />
	</div>
);
