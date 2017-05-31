import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import EmailAuth from './EmailAuth';
import SubmitEmail from './SubmitEmail';
import User from './User';
import Organization from './Organization';
import Team from './Team';
import Teams from './Teams';
import Room from './Room';
import Rooms from './Rooms';
import Message from './Message';
import MembersTeamRoom from './MembersTeamRoom';
// import TrackingMembersStatus from './TrackingMembersStatus';

export default combineReducers({
	form: formReducer,
	email_auth: EmailAuth,
	emailin: SubmitEmail,
   organization: Organization,
	user: User,
   team: Team,
	teams: Teams,
	room: Room,
	rooms: Rooms,
	message: Message,
	members: MembersTeamRoom
	// memberStatus : TrackingMembersStatus,
});
