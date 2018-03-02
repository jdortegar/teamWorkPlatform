import { connect } from 'react-redux';
import IntegrationDetailsPage from '../../pages/IntegrationDetailsPage';
import {
  fetchIntegrations,
  integrateIntegration,
  revokeIntegration
} from '../../actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations,
    subscriberOrgs: state.subscriberOrgs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchIntegrations: subscriberOrgId => dispatch(fetchIntegrations(subscriberOrgId)),
    integrateIntegration: (key, subscriberOrgId, params) => dispatch(integrateIntegration(key, subscriberOrgId, params)),
    revokeIntegration: (key, subscriberOrgId) => dispatch(revokeIntegration(key, subscriberOrgId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationDetailsPage);
