import { isEmpty } from 'lodash';
import { getCurrentOrgId, getTeamIds, getCurrentUserTeams, getActiveSurvey } from 'src/selectors';

import { fetchSubscriberOrgs } from './subscriberOrgsFetch';
import { fetchTeams } from './teamsFetch';
import { fetchSubscribersBySubscriberOrgId } from './subscribersFetch';
import { fetchSurveys, fetchLastAnswerDate } from './surveys';
import { fetchConversations } from './conversations';

// Fetch data from remote server if the orgId exists
// eslint-disable-next-line import/prefer-default-export
export const fetchGlobalState = () => (dispatch, getState) => {
  const state = getState();
  const orgId = getCurrentOrgId(state);

  if (isEmpty(state.subscriberOrgs.subscriberOrgById)) {
    dispatch(fetchSubscriberOrgs());
  }

  if (orgId) {
    dispatch(fetchConversations());

    if (isEmpty(getTeamIds(state)) || isEmpty(getCurrentUserTeams(state))) {
      dispatch(fetchTeams());
    }

    if (isEmpty(state.subscribers.subscriberUserIdBySubscriberOrgIdByUserId)) {
      dispatch(fetchSubscribersBySubscriberOrgId(orgId));
    }

    dispatch(fetchSurveys()).then(() => {
      const survey = getActiveSurvey(state);
      if (survey) dispatch(fetchLastAnswerDate(survey.id));
    });
  }
};
