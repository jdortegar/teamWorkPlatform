const INIT = { email : ''};
export default (state=INIT, action) => {
	switch (action.type) {
		case 'email_changed':
			return {...state, email : action.payload};
		default : return state;
	}
}