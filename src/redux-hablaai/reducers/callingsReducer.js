import {
  CALLING_RECEIVE,
  CALLING_RECEIVE_ANSWER,
  CALLING_FINISH,
  CALLING_TEAM_RECEIVE,
  CALLING_TEAM_RECEIVE_ANSWER
} from 'src/actions';

const INITIAL_STATE = {
  callerId: null,
  status: 'ready',
  teamId: null,
  receiverId: null
};

const callingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CALLING_RECEIVE: {
      const { callerId } = action.payload;

      return {
        ...state,
        callerId
      };
    }
    case CALLING_RECEIVE_ANSWER: {
      const { status } = action.payload;

      return {
        ...state,
        status
      };
    }
    case CALLING_TEAM_RECEIVE: {
      const { callerId, receiverTeamId } = action.payload;

      return {
        ...state,
        callerId,
        teamId: receiverTeamId
      };
    }
    case CALLING_TEAM_RECEIVE_ANSWER: {
      const { status, receiverId } = action.payload;

      return {
        ...state,
        status,
        receiverId
      };
    }
    case CALLING_FINISH: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
};

export default callingsReducer;
