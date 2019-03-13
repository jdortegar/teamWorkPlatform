import { MESSAGE_RECEIVE, NOTIFY_MESSAGE } from 'src/actions';

const INITIAL_STATE = {
  pushMessage: null
};

const notificationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFY_MESSAGE:
      return { ...state, pushMessage: action.payload.messages };
    case MESSAGE_RECEIVE:
      return { ...state, pushMessage: [action.payload.message] };
    default:
      return state;
  }
};

export default notificationsReducer;
