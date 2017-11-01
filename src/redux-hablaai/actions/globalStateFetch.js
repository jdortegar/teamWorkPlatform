import { fetchSubscriberOrgs } from './subscriberOrgsFetch';
import { fetchTeams } from './teamsFetch';
import { fetchTeamRooms } from './teamRoomsFetch';

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
  };
};
