import { CALLING_RECEIVE, CALLING_RECEIVE_ANSWER, CALLING_FINISH, CALLING_TEAM_RECEIVE } from 'src/actions';

const INITIAL_STATE = {
  callerId: null,
  accepted: false,
  teamId: null
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
      const { accepted } = action.payload;

      return {
        ...state,
        accepted
      };
    }
    case CALLING_FINISH: {
      return INITIAL_STATE;
    }
    case CALLING_TEAM_RECEIVE: {
      const { callerId, receiverTeamId } = action.payload;

      return {
        ...state,
        callerId,
        teamId: receiverTeamId
      };
    }
    default:
      return state;
  }
};

export default callingsReducer;
