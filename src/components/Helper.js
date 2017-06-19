import config from '../config/env';
import axios from 'axios';
import messaging from '../actions/messaging';

class Helper{
	constructor(user) {
      this.setUser(user);
		this.getResponseMessage = this.getResponseMessage.bind(this);
		this.getTeamRoomMembers = this.getTeamRoomMembers.bind(this);
		this.getConversations = this.getConversations.bind(this);
		this.getMessages = this.getMessages.bind(this);
		this.updateUserPreferences = this.updateUserPreferences.bind(this);
	}

   setUser(user) {
		this.user = user;
      if (user && user.token) {
   		this.token = `Bearer ${this.user.token}`;
      }
   }

	register(email) {
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

	getShortName(fullname) {
		const arrayName = fullname.split(' ');
		return arrayName.length > 1 ? arrayName[0].charAt(0)+arrayName[arrayName.length-1].charAt(0) : fullname;
	}

	getMemberIcon(members, memberId){
		let icon = "";
		members.map(member => {
			if (member.userId == memberId) {
				icon = member.icon == null ? null : "data:image/jpg;base64," + member.icon;
			}
		});
		return icon;
	}

	getMemberColor(members, memberId) {
		let color = "";
		members.map(member => {
			if (member.userId == memberId) {
				color = member.preferences.iconColor;
			}
		});
		return color;
	}

	getMemberName(members, memberId) {
		let name = "";
		members.map(member => {
			if (member.userId == memberId) {
				name = member.displayName;
			}
		});
		return name;
	}

	validateEmail(rid) {
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

	getRandomIntNumber (min, max) {
    	return Math.floor(Math.random()*(Math.floor(max)-Math.ceil(min)))+Math.ceil(min);
  	}

  	loginAuth(username, password) {
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
            this.token = `Bearer ${response.data.token}`;
             sessionStorage.setItem('jwt', response.data.token);
		    	resolve(response);
			})
			.catch(error => resolve(error))
		})
	}

	getOrgs() {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/subscriberOrgs/getSubscriberOrgs`;

			axios.get(url, { headers: { Authorization: this.token}})
			.then(respOrgs => {
            const orgs = respOrgs.data.subscriberOrgs;
            // for the first org, get the subscribers
            if (orgs.length == 0) {
               reject("No organizations for this user.");
            }

            let numRetrieved = 0;
            orgs.forEach(org => {
               // get subscribers for the organization
               this.getOrgSubscribers(org)
               .then(subscribers => {
                  org.subscribers = subscribers;
                  // console.log(`${org.name} has ${org.subscribers.length} subscribers`);
                  numRetrieved += 1;
                  if (numRetrieved === orgs.length) {
                     resolve(orgs);
                  }
               })
               .catch(error => {
                  console.log("*** getOrgs - getOrgSubscribers failed for org: " + org.name + " - " + JSON.stringify(error));
                  reject(error);
               })
            });
			})
         .catch(error => {
            console.log("*** getOrgs - getOrgs failed - " + JSON.stringify(error));
            reject(error);
         })
		})
	}

	getOrgSubscribers(org) {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/subscriberOrgs/getSubscribers/${org.subscriberOrgId}`;
			axios.get(url, { headers: { Authorization: this.token}})
			.then(response => {
            response.data.subscribers.forEach(subscriber => { subscriber.org = org; })
				resolve(response.data.subscribers)
			})
         .catch(error => {
            reject(error);
         })
		})
	}

	getTeams(subscriberOrg) {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/teams/getTeams?subscriberOrgId=${subscriberOrg.subscriberOrgId}`;
			axios.get(url, { headers : { Authorization: this.token}})
			.then(response => {
            response.data.teams.forEach(team => { team.org = subscriberOrg; })
				resolve(response.data.teams)
			})
         .catch(error => {
            reject(error);
         })
		})
	}

	getTeamRooms(team) {
		return new Promise((resolve, reject) => {
			const urlRooms = `${config.hablaApiBaseUri}/teamRooms/getTeamRooms?teamId=${team.teamId}`;
			axios.get(urlRooms, { headers: { Authorization: this.token}})
       		.then(response => {
       			resolve(response.data.teamRooms);
       		})
            .catch(error => {
               reject(error);
            })
		})
	}

   inviteSubscribersToOrg(org, userIdOrEmails) {
		return new Promise((resolve, reject) => {
         const url = `${config.hablaApiBaseUri}/subscriberOrgs/inviteSubscribers/${org.subscriberOrgId}`;
         const headers = {
            content_type: 'application/json',
            Authorization: this.token
         };
         const body = { userIdOrEmails };

         axios.post(url, body, { headers })
         .then((response) => {
            resolve(response);
         })
         .catch((error) => {
            reject(error);
         })
      });
   }

	connectWebSocket(websocketUrl) {

		messaging(websocketUrl).connect(this.token)
   		.then(() => {
   			console.log("connect successfully!");
   		})
   		.catch(error => console.log(error));
	}

	randomColor() {
		const avatar_colors = ['#e67e22','#3498db','#9b59b6',
	                           '#2ecc71','#1abc9c','#f1c40f',
	                           '#e67e22','#e74c3c','#7f8c8d',
	                           '#e91e63','#795548','#607d8b','#2196f3'];
    	return avatar_colors[this.getRandomIntNumber(0, avatar_colors.length-1)];
	}

	createUser({firstName, lastName, displayName, email, password, country, timeZone}) {
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
						iconColor: this.randomColor(),
					}
	    		}
	    	})
	        .then(response => {
	        	resolve(response)
	        })
	        .catch(error => reject(error))
		});
	}

	updateUserPreferences(preferences) {
		console.log({preferences});
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/users/updatePublicPreferences/${this.user.user.userId}`;
			const headers = {
				content_type: 'application/json',
				Authorization: this.token
			};
			axios.patch(url, {preferences }, { headers: headers })
			.then(result => resolve(result))
			.catch(error => reject(error))
		})
		
		
	}

	updateUserColor() {
		const url = `${config.hablaApiBaseUri}/users/updatePublicPreferences/${this.user.user.userId}`;
		const headers = {
			content_type: 'application/json',
			Authorization: this.token
		};
		axios.patch(url, {preferences: { iconColor: this.randomColor()}}, { headers: headers })
		.then(() => console.log("Updated iconColor"))
		.catch(error => console.log(error))
	}

	updateUserProfile({country, displayName, email, firstName, fullName, icon, lastName, timeZone}) {
		if (!this.user.user.preferences.hasOwnProperty('iconColor')) { //use to update icon color for previous account which do not have iconColo property
			this.updateUserColor();
		}
		return new Promise((resolve, reject) => {
			self = this;
			const headers = {
				content_type: 'application/json',
				Authorization: this.token
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

	getTeamMembers(teamId) {
		return new Promise((resolve, reject) => {
			const url = `${config.hablaApiBaseUri}/teams/getMembers/${teamId}`;
        	axios.get(url, { headers: { Authorization: this.token } })
        	.then( response => {
        		resolve(response.data.teamMembers)
        		return;
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

   _integrate(type, subscriberOrgId) {
      // TODO: anthony, Move this to page load.  Have to retrieve from persistence if it doesn't exist.
      this.token = this.token || `Bearer ${sessionStorage.getItem('jwt')}`;

      return new Promise((resolve, reject) => {
         // TODO: remove getting first org from list once a valid subscriberOrgId parameter is passed in.  This is just a hack until we have the concept of current Org context.
         Promise.all([])
            .then(() => {
               if (subscriberOrgId) {
                  return Promise.resolve(subscriberOrgId);
               }

               return axios.get(`${config.hablaApiBaseUri}/subscriberOrgs/getSubscriberOrgs`, { headers: { Authorization: this.token } });
            })
            .then(subscriberOrgIdOrResponse => {
               let subscriberOrgId;

               if (subscriberOrgIdOrResponse.data) {
                  // Will have at least 1 Org.
                  subscriberOrgId = subscriberOrgIdOrResponse.data.subscriberOrgs[0].subscriberOrgId;
               } else {
                  subscriberOrgId = subscriberOrgIdOrResponse;
               }

               return axios.get(`${config.hablaApiBaseUri}/integrations/${type}/integrate/${subscriberOrgId}`, { headers: { Authorization: this.token } });
            })
            .then( (response) => {
               if (response.status === 202) { // Redirect ourselves.
                  const redirectTo = response.data.location;
                  window.location.href = redirectTo;
               } else if (response.status === 404) {
                  // Bad subscriberOrgId.
                  // TODO: show error.
               } else if (response.status === 500) {
                  // TODO: Server error.  Tell Anthony to fix his crap.
               }

               resolve(response.data.messages);
            })
            .catch(err => reject(err));

		})
	}

	createSubscriberOrg({name,preferences}) {
		return new Promise((resolve, reject) =>{
			const url = `${config.hablaApiBaseUri}/subscriberOrgs/createSubscriberOrg`;
			const headers = {
				content_type: 'application/json',
				Authorization: this.token
			};
			const body = {name,preferences};
			axios.post(url,body, {headers})
			.then(result => resolve(result.data))
			.catch(error => reject(error))
		})
		
	}

	updateSubscriberOrg(OrgId, data) {
		return new Promise((resolve, reject) =>{
			const url = `${config.hablaApiBaseUri}/subscriberOrgs/updateSubscriberOrg/${OrgId}`;
			const headers = {
				content_type: 'application/json',
				Authorization: this.token
			};
			console.log("data "+data);
			const body = data;
			axios.patch(url, body, { headers })
			.then(result => resolve(result))
			.catch(error => reject(error))
		})
	}


	callGoogleDriveApi(subscriberOrgId = undefined) {
		return this._integrate('google', subscriberOrgId);
	}

	callBoxApi(subscriberOrgId) {
      return this._integrate('box', subscriberOrgId);
	}
}

const helper = new Helper();
export default helper;
