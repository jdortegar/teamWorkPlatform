export default function(state={rooms: ''}, action) {
  switch (action.type) {
    case 'store-rooms' :
      	return {...state, rooms : action.payload };
    default: return state;
  }
}

// [
// 	{
// 		active: true,
// 		name: "3.4 release",
// 		publish: false,
// 		purpose: "Prepare for next release",
// 		teamId: "sdfsdfs",
// 		teamRoomId: "sdfsdsf"

// 	},
// 	{
// 		...
// 	}

// ]

