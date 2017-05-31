export default function(state={orgs: []}, action) {
  switch (action.type) {
    case 'store-orgs' :
      	return {...state, orgs: action.payload };
    default: return state;
  }
}
