// import Dummy from '../Dummy';

// const init=Dummy().posts;
// state={posts: init}
export default function(state={posts: []}, action) {
  switch (action.type) {
    case 'store-posts' :
    	return {...state, posts: action.payload }; //not meaning at Dummy data
      	// return state;
    default: return state;
  }
}