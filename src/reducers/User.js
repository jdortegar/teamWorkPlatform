
const init = {
	user : {
		status: "SUCCESS",
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJlYTc5NDUxMC1jZWE2LTQxMzItYWUyMi1hN2FlMWQzMmFiYjIiLCJlbWFpbCI6InJvYmVydC5hYmJvdHRAaGFibGEuYWkiLCJpYXQiOjE0OTcyMTQxMTN9.mWswM80DxWfFuzOKHkjbym11uKDWquAn7ynwRLmCxtc",
				
		websocketUrl:"http://habla-fe-api-dev.habla.ai",
		user: {
			country: "US",
			displayName: "Rob Abbott",
			email: "robert.abbott@habla.ai",
			firstName: "Rob",
			icon: null,
			lastName: "Abbott",
			timeZone: "America/Los_Angeles",
			userType: "hablaUser",
			username: "robert.abbott@habla.ai",
			preferences: {
				iconColor: "#9b59b6",
				private: {}
			}
		}
	}
}	

export default function(state={user: null}, action) {
// export default function(state=init, action) {	
  switch (action.type) {
    case 'save-user' :
      	return {...state, user: action.payload }; //tweak login
    default: return state;
  }
}

/*------ user format ------- 
user {
	status: "SUCCESS",
	token: "dfsdfsdfsdfwef",
	user: {
		country: "US",
		displayName: "Son Dao",
		email: "son.dao@habla.ai",
		firstName: "Son",
		icon: null,
		lastName: "Dao",
		timeZone: "America/Los_Angeles",
		userType: "hablaUser",
		username: "son.dao@habla.ai"
	}
}
*/