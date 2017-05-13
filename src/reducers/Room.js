export default function(state={room: ''}, action) {
  switch (action.type) {
    case 'get-room' :
      	return {...state, room : action.payload };
    default: return state;
  }
}

// room : {
// name: "Development",
// subscriberOrgId: "dfsdfwefsd",
// teamId: "3423rwedsf"
// }