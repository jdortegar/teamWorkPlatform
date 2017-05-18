
// import config from '../config/env';
// import axios from 'axios';
export class Helper{
	constructor(user) {
		this.user = user;
		this.token = `Bearer ${this.user.token}`;
		this.getShortName = this.getShortName.bind(this);
		this.getMemberIcon = this.getMemberIcon.bind(this);
		this.getMemberName = this.getMemberName.bind(this);
		this.getResponseMessage = this.getResponseMessage.bind(this);
		this.getTeamRoomMembers = this.getTeamRoomMembers.bind(this);
		this.getConversations = this.getConversations.bind(this);
		this.getMessages = this.getMessages.bind(this);
	}

	function getShortName(fullname) {
		const arrayName = fullname.split(' ');
		return arrayName[0].charAt(0)+arrayName[arrayName.length-1].charAt(0);
	}

	function getMemberIcon(members, memberId){
		let icon = "";
		members.map(member => {
			if (member.userId == memberId) {
				icon = member.icon == null ? null : "data:image/jpg;base64," + member.icon;
			}
		});
		return icon;
	}

	function getMemberName(members, memberId) {
		let name = "";
		members.map(member => {
			if (member.userId == memberId) {
				name = member.displayName;
			}
		});
		return name;
	}

	function getResponseMessage(teamroomId, text, replyTo) {
		const conversations = this.getConversations(teamroomId);
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
        	return response.data.message;
        })
	}

	function getTeamRoomMembers(teamroomId) {
		const url = `${config.hablaApiBaseUri}/teamRooms/getMembers/${teamRoomId}`;
        axios.get(url, { headers: { Authorization: this.token } })
        .then( response => {
        	return response.data.teamRoomMembers;    
        });
	}

	function getConversations(teamroomId) {
		const urlCon = `${config.hablaApiBaseUri}/conversations/getConversations?teamRoomId=${teamRoomId}`;    
   		axios.get(urlCon, { headers : { Authorization: this.token}})
   		.then(response => {
   			return response.data.conversations;
   		})
	}

	function getMessages(teamroomId) {
		const conversations = this.getConversations(teamroomId);
		const conId = conversations[0].conversations;
		const urlTranscript = `${config.hablaApiBaseUri}/conversations/getTranscript/${conId}`;
        axios.get(urlTranscript, { headers: { Authorization: this.token } })
        .then( (response) => {
            return response.data.messages;
         });
	}
}