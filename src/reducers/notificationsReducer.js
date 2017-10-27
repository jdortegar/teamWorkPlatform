import {
  MESSAGES_RECEIVE,
  NOTIFY_MESSAGE
} from '../actions';

const INITIAL_STATE = {
  pushMessage: null
};

const notificationsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MESSAGES_RECEIVE:
    case NOTIFY_MESSAGE:
      return {
        ...state,
        pushMessage: action.payload.messages
      };
    default:
      return state;
  }
};

export default notificationsReducer;
