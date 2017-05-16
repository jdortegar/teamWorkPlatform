export default function(state, action) {
  switch (action.type) {
    case 'tracking-members-status' :
      	return {...state, membersStatus : action.payload };
    default: return state;
  }
}
