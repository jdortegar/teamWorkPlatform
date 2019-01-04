import messaging from '../messaging';

export const CALLING_RECEIVE = 'calling/receive';
export const CALLING_RECEIVE_ANSWER = 'calling/receiveAnswer';
export const CALLING_FINISH = 'calling/finish';
export const CALLING_TEAM_RECEIVE = 'calling/team/receive';

export const receiveCall = ({ callerId }) => ({
  type: CALLING_RECEIVE,
  payload: { callerId }
});

export const receiveCallAnswer = ({ status }) => ({
  type: CALLING_RECEIVE_ANSWER,
  payload: { status }
});

export const finishCall = () => dispatch => dispatch({ type: CALLING_FINISH });

export const receiveTeamCall = ({ callerId, receiverTeamId }) => ({
  type: CALLING_TEAM_RECEIVE,
  payload: { callerId, receiverTeamId }
});

export const makePersonalCall = (callerId, receiverId) => () => {
  messaging().makePersonalCall(callerId, receiverId);
};

export const answerCall = (callerId, status) => () => {
  messaging().answerCall(callerId, status);
};

export const makeTeamCall = (callerId, receiverTeamId) => () => {
  messaging().makeTeamCall(callerId, receiverTeamId);
};
