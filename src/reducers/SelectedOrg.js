export default function(state={org: ''}, action) {
  switch (action.type) {
    case 'store-org':
      	return {...state, org: action.payload };
    default:
         return state;
  }
}
