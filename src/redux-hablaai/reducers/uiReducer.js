import { combineReducers } from 'redux';
import { UI_CKG_CHANGE_VIEW, CKG_VIEWS } from 'src/actions';

const ckg = (state = { activeView: CKG_VIEWS.FILE_LIST }, action) => {
  switch (action.type) {
    case UI_CKG_CHANGE_VIEW:
      return { ...state, activeView: action.payload.activeView };
    default:
      return state;
  }
};

export default combineReducers({ ckg });
