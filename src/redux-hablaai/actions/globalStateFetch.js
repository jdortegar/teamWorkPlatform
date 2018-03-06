import { fetchSubscriberOrgs } from './subscriberOrgsFetch';
import { fetchTeams } from './teamsFetch';
import { fetchTeamRooms } from './teamRoomsFetch';
import { fetchReadMessages } from './readMessagesFetch';
import { fetchSubscribersBySubscriberOrgId } from './subscribersFetch';

/**
 * For global state, fetch data from remote server only if data doesn't exist in redux.
 *
 * @returns {function(*, *)}
 */
export const fetchGlobalState = () => { // eslint-disable-line import/prefer-default-export
  return (dispatch, getState) => {
    const state = getState();
    if (Object.keys(state.subscriberOrgs.subscriberOrgById).length === 0) {
      dispatch(fetchSubscriberOrgs());
    }
    if (Object.keys(state.teams.teamById).length === 0) {
      dispatch(fetchTeams());
    }
    if (Object.keys(state.teamRooms.teamRoomById).length === 0) {
      dispatch(fetchTeamRooms());
    }
    if (Object.keys(state.readMessages.readMessagesByConversationId).length === 0) {
      dispatch(fetchReadMessages());
    }
    if (Object.keys(state.subscribers.subscriberUserIdBySubscriberOrgIdByUserId).length === 0) {
      const { currentSubscriberOrgId } = state.subscriberOrgs;
      if (currentSubscriberOrgId) {
        dispatch(fetchSubscribersBySubscriberOrgId(currentSubscriberOrgId));
      }
    }
  };
};
