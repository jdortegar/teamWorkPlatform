import axios from 'axios';
import config from '../config/env';

export const email_changed = (input) => {
	return {
		type: 'email_changed',
		payload: input
	};
};

export const user = (user) => {
	return {
		type: 'save-user',
		payload: user
	}
};

export const orgs = (orgs) => {
	return {
		type: 'store-orgs',
		payload: orgs
	}
};

export const selectTeam = (team) => {
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

export const saveMembersTeamRoom = (members) => {
	return {
		type: 'save-members-teamroom',
		payload: members
	}
}

export const selectedOrg = (org) => {
	return {
		type: 'store-org',
		payload: org
	}
}


