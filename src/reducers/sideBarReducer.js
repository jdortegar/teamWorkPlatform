import {
  TOGGLE_SIDEBAR,
  SHOW_SIDEBAR
} from '../actions';

const INITIAL_STATE = {
  hidden: false
};

const sideBarReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        hidden: !state.hidden
      };
    case SHOW_SIDEBAR:
      return {
        ...state,
        hidden: false
      };
    default:
      return state;
  }
};

export default sideBarReducer;
