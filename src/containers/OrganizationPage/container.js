import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OrganizationPage from '../../pages/OrganizationPage';
import { requestSubscribers,
  requestIntegrations,
  setCurrentSubscriberOrgId,
  toggleTeamDialog,
  toggleInvitePeopleDialog } from '../../actions';

function mapStateToProps(state) {
  return {
    teams: state.teams,
    subscriberOrgs: state.subscriberOrgs,
    integrations: state.integrations,
    subscribers: state.subscribers,
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
