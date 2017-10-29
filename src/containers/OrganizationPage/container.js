import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OrganizationPage from '../../pages/OrganizationPage';
import { fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  toggleTeamDialog,
  toggleInvitePeopleDialog,
} from '../../actions';
import { getSubscribersOfSubscriberOrgId,
  getTeamsOfSubscriberOrgIdSortedAlphabetically,
  getIntegrationsOfSubscriberOrgId
} from '../../selectors';

function mapStateToProps(state, props) {
  const subscriberOrgId = props.match.params.subscriberOrgId;

  return {
    user: state.auth.user,
    subscriberOrgs: state.subscriberOrgs,
    integrations: state.integrations,
    subscribers: getSubscribersOfSubscriberOrgId(state, subscriberOrgId),
    teams: getTeamsOfSubscriberOrgIdSortedAlphabetically(state, subscriberOrgId),
    integrations2: getIntegrationsOfSubscriberOrgId(state, subscriberOrgId),
    teamRooms: state.teamRooms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSubscribersBySubscriberOrgId: subscriberOrgId => dispatch(fetchSubscribersBySubscriberOrgId(subscriberOrgId)),
    fetchIntegrations: subscriberOrgId => dispatch(fetchIntegrations(subscriberOrgId)),
    setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId)),
    toggleTeamDialog: status => dispatch(toggleTeamDialog(status)),
    toggleInvitePeopleDialog: status => dispatch(toggleInvitePeopleDialog(status))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationPage));
