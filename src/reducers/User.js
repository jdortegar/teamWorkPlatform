
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

const aws_tho = {
	user : {
		status: "SUCCESS",
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI0NmViMTNiZS0wN2RmLTRkZjItOGQ3ZC1lMzdkYTM4NTI4YjkiLCJlbWFpbCI6InRoby50cnVvbmdAaGFibGEuYWkiLCJpYXQiOjE0OTg5NzgwMjZ9.uBbbWKbMvAm_NcpPuYixJ-H237jFGBoIsNYcnXZ_0SE",
				
		websocketUrl:"http://habla-fe-api-dev.habla.ai",
		user: {
			country: "United States",
			displayName: "Tho Truong",
			email: "tho.truong@habla.ai",
			firstName: "Tho",
			icon: null,			
			lastName: "Truong",
			timeZone: "America/Los_Angeles",
			userId: "46eb13be-07df-4df2-8d7d-e37da38528b9",
			userType: "admin",
			username: "tho.truong@habla.ai",
			preferences: {
				iconColor: "#1abc9c",
				private: {}
			}
		}
	}
}

const init2 = {
	user : {
		status: "SUCCESS",
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJjODJhY2RhMi01Yjk5LTQ1YzEtOWY2OS1jYzY5NDA0ZDY5MDUiLCJlbWFpbCI6InRob0BoYWJsYS5pbyIsImlhdCI6MTQ5Nzg1NTA2Mn0.VFoAMtot3ZrbcllCYGXdtA9supZ31Dbxp6GDMaTHt8I",
				
		websocketUrl:"http://habla-fe-api-dev.habla.ai",
		user: {
			country: "US",
			displayName: "Tho Truong",
			email: "tho@habla.io",
			firstName: "Tho",
			icon: null,
			lastName: "T.",
			timeZone: "America/Los_Angeles",
			userId: "c82acda2-5b99-45c1-9f69-cc69404d6905",
			userType: "admin",
			username: "tho@habla.io",
			preferences: {
				iconColor: "#e67e22",
				lastOrg: "e67267b4-7b02-4764-aa27-c38bfde3ffee",
				lastTeam: "93a00230-4825-470a-bc9f-396016ff1fdc",
				private: {}
			}
		}
	}
}




// export default function(state={user: null}, action) {
export default function(state=init, action) {	
// export default function(state=aws_tho, action) {	
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