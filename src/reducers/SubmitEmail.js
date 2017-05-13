export default function(state=[], action) {
	switch (action.type) {
		case 'submitEmail':
			return [...state, action.payload];
		default: return state;
	}
}