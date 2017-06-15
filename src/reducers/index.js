import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import EmailAuth from './EmailAuth';
import SubmitEmail from './SubmitEmail';
import User from './User';
import SelectedOrg from './SelectedOrg';
import Team from './Team';
import Teams from './Teams';
import Room from './Room';
import Rooms from './Rooms';
import Message from './Message';
import MembersTeamRoom from './MembersTeamRoom';
import Orgs from './Orgs';
// import TrackingMembersStatus from './TrackingMembersStatus';

export default combineReducers({
	form: formReducer,
	email_auth: EmailAuth,
	emailin: SubmitEmail,
	orgs: Orgs,
    org: SelectedOrg,
	user: User,
    team: Team,
	teams: Teams,
	room: Room,
	rooms: Rooms,
	message: Message,
	members: MembersTeamRoom
	// memberStatus : TrackingMembersStatus,
});
