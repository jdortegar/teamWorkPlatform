import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OrganizationPage from '../../pages/OrganizationPage';
import { requestSubscribers, requestIntegrations, setCurrentSubscriberOrgId } from '../../actions';

function mapStateToProps(state) {
  return {
    teams: state.teams,
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId,
    integrations: state.integrations,
    subscribers: state.subscribers
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestSubscribers: subscriberOrgId => dispatch(requestSubscribers(subscriberOrgId)),
    requestIntegrations: subscriberOrgId => dispatch(requestIntegrations(subscriberOrgId)),
    setCurrentSubscriberOrgId: subscriberOrgId => dispatch(setCurrentSubscriberOrgId(subscriberOrgId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationPage));
