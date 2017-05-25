import config from '../config/env';
import axios from 'axios';
import messaging from '../actions/messaging';

export default class Helper{
	constructor(user) {
		this.user = user;
		this.token = `Bearer ${this.user.token}`;
		this.getResponseMessage = this.getResponseMessage.bind(this);
		this.getTeamRoomMembers = this.getTeamRoomMembers.bind(this);
		this.getConversations = this.getConversations.bind(this);
		this.getMessages = this.getMessages.bind(this);
	}

	static register(email) {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/users/registerUser`;
			const url_type = 'application/x-www-form-urlencoded';
			axios({
				method: 'post',
				url: url,
				body: {
					'content-type': url_type
				},
				data: {
					email: email,
				}
			})
			.then(response => resolve(response))
			.catch(error => reject(error))
		})
	}

	static getShortName(fullname) {
		const arrayName = fullname.split(' ');	
		return arrayName.length > 1 ? arrayName[0].charAt(0)+arrayName[arrayName.length-1].charAt(0) : fullname;
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

	static getRandomIntNumber (min, max) {
    	return Math.floor(Math.random()*(Math.floor(max)-Math.ceil(min)))+Math.ceil(min);
  	}

  	static loginAuth(username, password) {
		return new Promise((resolve, reject) => {
			axios({
  				method: 'post',
  				url: `${config.hablaApiBaseUri}/auth/login`,
  				body: {
  					'content-type': 'application/x-www-form-urlencoded'
		  		},
		  		data: {
			        username: username,
			        password: password,
		  		}
		  	})
		    .then(response => {
		    	resolve(response);
			})
			.catch(error => resolve(error))
		})
	}

	static getTeams(userToken) {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/teams/getTeams`;
			axios.get(url, { headers : { Authorization: userToken}})
			.then(response => {
				resolve(response.data.teams)
			})
		}) 		
	}

	static getTeamRooms(userToken) {
		const httpToken = `Bearer ${userToken}`;
		return new Promise((resolve, reject) => {
			const urlRooms = `${config.hablaApiBaseUri}/teamRooms/getTeamRooms`;
			axios.get(urlRooms, { headers: { Authorization: httpToken}})
       		.then(response => {
       			resolve(response.data.teamRooms);
       		})
		})
	}

	static connectWebSocket(websocketUrl, token) {
		
		messaging(websocketUrl).connect(token)
   		.then(() => {
   			console.log("connect successfully!");
   		})
   		.catch(error => console.log(error));
	}

	static randomColor() {
		const avatar_colors = ['#e67e22','#3498db','#9b59b6',
	                           '#2ecc71','#1abc9c','#f1c40f',
	                           '#e67e22','#e74c3c','#7f8c8d',
	                           '#e91e63','#795548','#607d8b','#2196f3'];
    	return avatar_colors[Helper.getRandomIntNumber(0, avatar_colors.length-1)];
	}

	static createUser({firstName, lastName, displayName, email, password, country, timeZone}) {
		return new Promise((resolve, reject) => {
			axios({
	    		method: 'post',
	    		url: `${config.hablaApiBaseUri}/users/createUser`,
	    		body: {
	    			'content-type': 'application/json'
	    		},
	    		data: {
	    			firstName,
					lastName,
					displayName,
					email,
					password,
					icon: null,
					country,
					timeZone,
					preferences: {
						iconColor: Helper.randomColor(),
					}
	    		}
	    	})
	        .then(response => {
	        	resolve(response)
	        })
	        .catch(error => reject(error))
		});
	}

	updateUserProfile({country, displayName, email, firstName, fullName, icon, lastName, timeZone}) { 

		return new Promise((resolve, reject) => {
			self = this;
			const headers = {
				content_type: 'application/json',
				Authorization: self.token
			} 
			const url = `${config.hablaApiBaseUri}/users/updateUser`;
			axios.patch(url, {
				firstName,
				lastName,
				displayName,
				country,
				timeZone,
				icon,
			},
			{headers})
			.then(() => resolve())
			.catch(error => reject(error))
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
   				// console.log(response);
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
	            	resolve(response.data.messages);
	         	});
			})
			.catch(error => {
				reject(error);
			})
		})     
	}

	

}





