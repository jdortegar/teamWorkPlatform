export default function(state={teams: []}, action) {
  switch (action.type) {
    case 'store-teams' :
      	return {...state, teams : action.payload };
    default: return state;
  }
}

/*
user.teams = [{
	name: "Development",
	subscriberOrgId: "dfsdfwefsd",
	teamId: "3423rwedsf"
},{...}]
*/
