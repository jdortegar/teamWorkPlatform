// TODO: remove this file if not needed.
import {
  TOGGLE_SIDEBAR
} from '../actions/types';

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
    default:
      return state;
  }
};

export default sideBarReducer;
