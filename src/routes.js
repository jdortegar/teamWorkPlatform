import React from 'react';
import { Route, IndexRoute, Router, browserHistory } from 'react-router';
import Habla from './pages/route_container';
import Homepage from './pages/homepage/Homepage';
import TeamRoom from './pages/team/TeamRoom';

const componentRoutes = {
	component: Habla,
	path: '/',
	indexRoute: { component: Homepage},
	childRoutes: [
		{
			path: 'register',
			getComponent(location, cb) {
				System.import('./pages/user/Register')
					.then(module => cb(null, module.default))    //null is 1st element for error object
			}
		},
		{
			path: 'forgotpass',
			getComponent(location, cb) {
				System.import('./pages/user/ForgotPass')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'resetpass',
			getComponent(location, cb) {
				System.import('./pages/user/ResetPass')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'successful',
			getComponent(location, cb) {
				System.import('./pages/user/RegNotify')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'signup/:rid',
			getComponent(location, cb) {
				System.import('./pages/user/CreateAccount')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'signin',
			getComponent(location, cb) {
				System.import('./pages/user/SignIn')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'profile-edit',
			getComponent(location, cb) {
				System.import('./pages/user/ProfileEdit')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'profile-notify',
			getComponent(location, cb) {
				System.import('./pages/user/ProfileNotify')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'org-profile',
			getComponent(location, cb) {
				System.import('./pages/org/OrgProfile')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'org-update',
			getComponent(location, cb) {
				System.import('./pages/org/OrgUpdate')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'org-notify',
			getComponent(location, cb) {
				System.import('./pages/org/OrgNotify')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'org-invite',
			getComponent(location, cb) {
				System.import('./pages/org/OrgInvite')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'product',
			getComponent(location, cb) {
				System.import('./pages/general/Product')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'team/createTeamRoom',
			getComponent(location, cb) {
				System.import('./pages/team/CreateTeamRoom')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'pricing',
			getComponent(location, cb) {
				System.import('./pages/general/Pricing')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'app-directory',
			getComponent(location, cb) {
				System.import('./pages/general/AppDirectory')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'summarization',
			getComponent(location, cb) {
				System.import('./pages/team/Summarization')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'teams/:team',
			getComponent(location, cb) {
				System.import('./pages/team/RoomsList')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'privacy',
			getComponent(location, cb) {
				System.import('./pages/general/Privacy')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'security',
			getComponent(location, cb) {
				System.import('./pages/general/Security')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'terms-of-service',
			getComponent(location, cb) {
				System.import('./pages/general/TermsOfService')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'team/teamroom/:room',
			getComponent(location, cb) {
				System.import('./pages/team/TeamRoom')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'organizations/:organization',
			getComponent(location, cb) {
				System.import('./pages/team/TeamsList')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'mprivacy',
			getComponent(location, cb) {
				System.import('./pages/general/mPrivacy')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'mterms-of-service',
			getComponent(location, cb) {
				System.import('./pages/general/mTermsOfService')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'msecurity',
			getComponent(location, cb) {
				System.import('./pages/general/mSecurity')
					.then(module => cb(null, module.default))
			}
		},
		{
			path: 'organizations',
			getComponent(location, cb) {
				System.import('./pages/org/OrgsList')
					.then(module => cb(null, module.default))
			}
		},

	]
}

const Routes = () => {
	return (
		<Router history={browserHistory} routes={componentRoutes} />
	);
};

export default Routes;
