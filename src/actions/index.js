import axios from 'axios';
import config from '../config/env';

const url = `${config.hablaApiBaseUri}/users/registerUser`;
const url_type = 'application/x-www-form-urlencoded';

export const email_changed = (input) => {
	return {
		type: 'email_changed',
		payload: input
	};
};

/*
export const submitEmail = (email) => {
	const request = axios({
		method: 'post',
		url: url,
		body: {
			'content-type': url_type
		},
		data: {
			email:email
		}
	});

	return {
		type: 'submitEmail',
		payload: request
	}
};
*/

export const submitEmail = (email) => {
	
	const request=axios({
			method: 'post',
			url: url,
			body: {
				'content-type': url_type
			},
			data: {
				email:email
			}
		})
	return (dispatch) => {
		request.then(({data}) => {
			dispatch({
				type: 'submitEmail',
				payload: data
			});
		})
	}
};

export const user = (user) => {
	return {
		type: 'save-user',
		payload: user
	}
};

export const organization = (organization) => {
	return {
		type: 'store-organization',
		payload: organization
	}
};

export const orgs = (orgs) => {
	return {
		type: 'store-orgs',
		payload: orgs
	}
};

export const team = (team) => {
	return {
		type: 'store-team',
		payload: team
	}
}

export const teams = (teams) => {
	return {
		type: 'store-teams',
		payload: teams
	}
}

export const rooms = (rooms) => {
	return {
		type: 'store-rooms',
		payload: rooms
	}
}

export const selectRoom = (room) => {
	return {
		type: 'get-room',
		payload: room
	}
}

export const inviteTeamMembers = (team) => {
	return {
		type: 'invite-team-members',
		payload: team
	}
}

export const teammembers = (room) => { //use axios to get member, this is for dummy data
	return {
		type: 'get-members',
		payload: team
	}
}

export const saveMembersTeamRoom = (members) => {
	return {
		type: 'save-members-teamroom',
		payload: members
	}
}


