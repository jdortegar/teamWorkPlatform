import { isEmpty } from 'lodash';
import { getTeamIds, getOrgTeams } from 'src/selectors';

import { fetchSubscriberOrgs } from './subscriberOrgsFetch';
import { fetchTeams } from './teamsFetch';
import { fetchReadMessages } from './readMessagesFetch';
import { fetchSubscribersBySubscriberOrgId } from './subscribersFetch';
import { fetchSurveys } from './surveys';

/**
 * For global state, fetch data from remote server only if data doesn't exist in redux.
 *
 * @returns {function(*, *)}
 */
// eslint-disable-next-line import/prefer-default-export
export const fetchGlobalState = () => (dispatch, getState) => {
  const state = getState();
  const { currentSubscriberOrgId } = state.subscriberOrgs;
  const orgNotFetched = currentSubscriberOrgId && isEmpty(getOrgTeams(state, currentSubscriberOrgId));

  if (Object.keys(state.subscriberOrgs.subscriberOrgById).length === 0) {
    dispatch(fetchSubscriberOrgs());
  }
  if (isEmpty(getTeamIds(state)) || orgNotFetched) {
    dispatch(fetchTeams());
  }
  if (Object.keys(state.readMessages.readMessagesByConversationId).length === 0) {
    dispatch(fetchReadMessages());
  }
  if (Object.keys(state.subscribers.subscriberUserIdBySubscriberOrgIdByUserId).length === 0) {
    if (currentSubscriberOrgId) {
      dispatch(fetchSubscribersBySubscriberOrgId(currentSubscriberOrgId));
    }
  }
  if (state.surveys.dates.length === 0) {
    if (currentSubscriberOrgId) {
      dispatch(fetchSurveys());
    }
  }
};
