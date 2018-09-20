import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchSubscribersBySubscriberOrgId, fetchIntegrations, setCurrentSubscriberOrgId } from 'src/actions';
import {
  getCurrentUser,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getIntegrationsOfSubscriberOrgId
} from 'src/selectors';
import { OrganizationPage } from 'src/pages';

function mapStateToProps(state, props) {
  const { subscriberOrgId } = props.match.params;

  return {
    user: getCurrentUser(state),
    subscriberOrgs: state.subscriberOrgs,
    subscribers: getSubscribersOfSubscriberOrgId(state, subscriberOrgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    teams: getTeamsOfSubscriberOrgIdSortedAlphabetically(state, subscriberOrgId),
    integrations: getIntegrationsOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId),
    teamRooms: state.teamRooms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSubscribersBySubscriberOrgId: subscriberOrgId => dispatch(fetchSubscribersBySubscriberOrgId(subscriberOrgId)),
    fetchIntegrations: subscriberOrgId => dispatch(fetchIntegrations(subscriberOrgId)),
    setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationPage)
);
