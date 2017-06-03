export default function(state={message: ''}, action) {
  switch (action.type) {
    case 'send-message' :
    	// console.log(action.payload);
      	return {...state, message : action.payload };
    default: return state;
  }
}