import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../layout/NotFound';
import Alert from '../layout/Alert';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Dashboard from '../dashboard/Dashboard1';
import CreateProfile from '../profile-form/CreateProfile';
import EditProfile from '../profile-form/EditProfile';
import AddExperience from '../profile-form/AddExperience';
import AddEducation from '../profile-form/AddEducation';
import Profiles from '../profiles/Profiles';
import PrivateRoute from '../routing/PrivateRoute';
import Profile from '../profile/Profile';
import Posts from '../posts/Posts';
import Post from '../post/Post';
const Routes = () => {
	return (
		<div className='container'>
			<Alert />
			<Switch>
				<Route exact path='/register' component={Register} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/profiles' component={Profiles} />
				<PrivateRoute exact path='/profile/:id' component={Profile} />
				<PrivateRoute exact path='/dashboard' component={Dashboard} />

				<PrivateRoute exact path='/create-profile' component={CreateProfile} />
				<PrivateRoute exact path='/edit-profile' component={EditProfile} />
				<PrivateRoute exact path='/add-experience' component={AddExperience} />
				<PrivateRoute exact path='/add-education' component={AddEducation} />
				<PrivateRoute exact path='/posts' component={Posts} />
				<PrivateRoute exact path='/posts/:id' component={Post} />
				<Route component={NotFound} />
			</Switch>
		</div>
	);
};

export default Routes;
