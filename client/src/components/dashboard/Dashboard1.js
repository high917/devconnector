import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { Link } from 'react-router-dom';

const Dashboard = ({
	getCurrentProfile,
	deleteAccount,
	auth: { user },
	profile: { profile, loading }
}) => {
	useEffect(() => {
		getCurrentProfile();
	}, [getCurrentProfile]);
	return loading && profile === null ? (
		<Spinner className='mr-tb' />
	) : (
		<div className='mr-tb'>
			<h1 className='large text-primary'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user' />
				&nbsp;Welcome {user && user.name}
			</p>
			{profile !== null ? (
				<Fragment>
					<DashboardActions />
					<Experience experience={profile.experience} />
					<Education education={profile.education} />
					<div className='my-2'>
						<button className='btn btn-danger' onClick={() => deleteAccount()}>
							<i className='fas fas-user-minus' />
							Delete My Account
						</button>
					</div>
				</Fragment>
			) : (
				<Fragment>
					<p>You have not yet Set Up a profile, please add some info</p>
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create Profile
					</Link>
				</Fragment>
			)}
		</div>
	);
};

Dashboard.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(
	mapStateToProps,
	{ getCurrentProfile, deleteAccount }
)(Dashboard);
