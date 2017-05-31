export default function(state={organization: null}, action) {
  switch (action.type) {
    case 'store-organization':
      	return {...state, organization: action.payload };
    default:
         return state;
  }
}
