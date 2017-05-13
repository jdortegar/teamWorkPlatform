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
	return (dispatch) => {
		axios({
			method: 'post',
			url: url,
			body: {
				'content-type': url_type
			},
			data: {
				email:email
			}
		})
		.then(request => {
			dispatch({
				type: 'submitEmail',
				payload: request
			})
		})
	}
};

export const user = (user) => {
	return {
		type: 'save-user',
		payload: user
	}
};

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

export const teammembers = (room) => { //use axios to get member, this is for dummy data
	return {
		type: 'get-members',
		payload: team
	}
}


export const getPosts = (posts) => {
	return {
		type: 'store-posts',
		payload: posts
	}
}

export const sendMessage = (roomId, token, text, replyTo) => {
	return (dispatch) => {
		let urlConversation = `${config.hablaApiBaseUri}/conversations/getConversations?teamRoomId=${roomId}`;
		axios.get(urlConversation, { headers : { Authorization: token}})
   		//Get teamroom success
		.then(response => {
			if (response.status == 200) {
				// conversations = [ {conversationId:"dfsdf", participants: [{country:"US", displayName: "Rob", icon: null, lastName: "Abbott", preferences : {}, timeZone: "America/Los_Angeles", userId: "sdfsdfds"},{},{}] },{...}]
				let conId = response.data.conversations[0].conversationId;
				let urlSend = `${config.hablaApiBaseUri}/conversations/${conId}/createMessage`;
	         let body;
	         if (replyTo) {
	            body = { messageType: "text", text, replyTo };
	         }
	         else {
	            body = { messageType: "text", text };
	         }
	         const headers = {
	            content_type: 'application/json',
	            Authorization: token
	         };

	         axios.post(urlSend, body, { headers })
	         .then( (response) => {
	            // console.log(response.data.message);
	            // message = response.data.message;
	            dispatch({
	            	type: 'send-message',
					payload: response
	            })
	          })  
	         // .catch(error => console.log(error))
	   		}
	 	})
		// .catch(error => console.log(error))
	}
}