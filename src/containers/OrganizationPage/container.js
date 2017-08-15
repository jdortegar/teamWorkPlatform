import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OrganizationPage from '../../pages/OrganizationPage';
import { requestSubscribers,
  requestIntegrations,
  setCurrentSubscriberOrgId,
  toggleTeamDialog,
  toggleInvitePeopleDialog } from '../../actions';
import { getSubscribersOfSubscriberOrgId,
  getTeamsOfSubscriberOrgId,
  getIntegrationsOfSubscriberOrgId
} from '../../selectors';

function mapStateToProps(state, props) {
  const subscriberOrgId = props.match.params.subscriberOrgId;

  return {
    subscriberOrgs: state.subscriberOrgs,
    integrations: state.integrations,
    subscribers: getSubscribersOfSubscriberOrgId(state, subscriberOrgId),
    teams: getTeamsOfSubscriberOrgId(state, subscriberOrgId),
    integrations2: getIntegrationsOfSubscriberOrgId(state, subscriberOrgId)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestSubscribers: subscriberOrgId => dispatch(requestSubscribers(subscriberOrgId)),
    requestIntegrations: subscriberOrgId => dispatch(requestIntegrations(subscriberOrgId)),
    setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId)),
    toggleTeamDialog: status => dispatch(toggleTeamDialog(status)),
    toggleInvitePeopleDialog: status => dispatch(toggleInvitePeopleDialog(status))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationPage));
