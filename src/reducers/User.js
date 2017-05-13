
// const init = {
// 	status: "SUCCESS",
// 	token: "dfsdfsdfsdfwef",
// 	user: {
// 		country: "US",
// 		displayName: "Son Dao",
// 		email: "son.dao@habla.ai",
// 		firstName: "Son",
// 		icon: null,
// 		lastName: "Dao",
// 		timeZone: "America/Los_Angeles",
// 		userType: "hablaUser",
// 		username: "son.dao@habla.ai"
// 	}
// }	

export default function(state={user: null}, action) {
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