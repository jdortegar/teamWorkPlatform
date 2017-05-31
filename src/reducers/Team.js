export default function(state={team: null}, action) {
  switch (action.type) {
    case 'store-team':
      	return {...state, team: action.payload };
    default:
         return state;
  }
}
