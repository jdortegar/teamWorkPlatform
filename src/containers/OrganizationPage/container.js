import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import OrganizationPage from '../../pages/OrganizationPage';
import { requestIntegrations, setCurrentSubscriberOrgId } from '../../actions';

function mapStateToProps(state) {
  return {
    teams: state.teams,
    currentSubscriberOrgId: state.subscriberOrgs.currentSubscriberOrgId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestIntegrations: () => dispatch(requestIntegrations()),
    setCurrentSubscriberOrgId: () => dispatch(setCurrentSubscriberOrgId())
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrganizationPage));
