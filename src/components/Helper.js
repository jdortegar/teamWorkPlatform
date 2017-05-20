import config from '../config/env';
import axios from 'axios';

export default class Helper{
	constructor(user) {
		this.user = user;
		this.token = `Bearer ${this.user.token}`;
		this.getResponseMessage = this.getResponseMessage.bind(this);
		this.getTeamRoomMembers = this.getTeamRoomMembers.bind(this);
		this.getConversations = this.getConversations.bind(this);
		this.getMessages = this.getMessages.bind(this);
	}

	static getShortName(fullname) {
		const arrayName = fullname.split(' ');
		return arrayName[0].charAt(0)+arrayName[arrayName.length-1].charAt(0);
	}

	static getMemberIcon(members, memberId){
		let icon = "";
		members.map(member => {
			if (member.userId == memberId) {
				icon = member.icon == null ? null : "data:image/jpg;base64," + member.icon;
			}
		});
		return icon;
	}

	static getMemberName(members, memberId) {
		let name = "";
		members.map(member => {
			if (member.userId == memberId) {
				name = member.displayName;
			}
		});
		return name;
	}

	static validateEmail(rid) {
		return new Promise((resolve, reject) => {
			axios({
		       method: 'get',
		       url: `${config.hablaApiBaseUri}/users/validateEmail/${rid}`,
		       body: {
		          'content-type': 'application/json'
		       }
		    })
		    .then((response) => {
		    	resolve(response);
			})
			.catch(error => reject(error));
		})
	}

	getResponseMessage(teamRoomId, text, replyTo) {
		return new Promise((resolve, reject) => {
			this.getConversations(teamRoomId)
			.then(conversations => {
				const conId = conversations[0].conversationId;
				const url = `${config.hablaApiBaseUri}/conversations/${conId}/createMessage`;
		        let body;
		        if (replyTo) body = { messageType: "text", text, replyTo };
		        else body = { messageType: "text", text };
		        const headers = {
		        	content_type: 'application/json',
		            Authorization: this.token
		        };
		        axios.post(url, body, { headers })
		        .then( (response) => {
		        	resolve(response.data.message);
		        	return;
		        })
			})
			.catch(error => reject(error))	
		})
	}

	getTeamRoomMembers(teamRoomId) {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/teamRooms/getMembers/${teamRoomId}`;
        	axios.get(url, { headers: { Authorization: this.token } })
        	.then( response => {
        		resolve(response.data.teamRoomMembers)
        		return;
        	})
        	.catch(error => reject(error))
		})		
	}

	getConversations(teamRoomId) {
		return new Promise((resolve, reject) => {
			const urlCon = `${config.hablaApiBaseUri}/conversations/getConversations?teamRoomId=${teamRoomId}`;    
   			axios.get(urlCon, { headers : { Authorization: this.token}})
   			.then(response => {
   				resolve(response.data.conversations);
   				return;
   			})
   			.catch(error => {
   				reject(error);
   			})
		})	
	}

	getMessages(teamRoomId) {
		return new Promise((resolve, reject) => {
			this.getConversations(teamRoomId)
			.then(conversations => {
				const conId = conversations[0].conversationId;
				const urlTranscript = `${config.hablaApiBaseUri}/conversations/getTranscript/${conId}`;
				axios.get(urlTranscript, { headers: { Authorization: this.token } })
	        	.then( (response) => {
	            	resolve(response.data.messages)
	         	});
			})
			.catch(error => {
				reject(error);
			})
		})     
	}
}