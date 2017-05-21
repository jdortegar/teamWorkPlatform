const init = {
	room : {
		active:true,
		name:"Intelligent Mockup",
		publish:true,
		purpose:"UI sprint planning.",
		teamId:"ea794510-cea6-4132-0008-a7ae1d32abb5",
		teamRoomId:"ea794510-cea6-4132-0016-a7ae1d32abb5"
				
	}
}


// export default function(state={room: ''}, action) {
export default function(state=init, action) {
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