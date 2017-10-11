import { connect } from 'react-redux';
import IntegrationDetailsPage from '../../pages/IntegrationDetailsPage';
import {
  requestIntegrations,
  integrateBox,
  integrateGoogle,
  revokeBox,
  revokeGoogle
} from '../../actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations,
    subscriberOrgs: state.subscriberOrgs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestIntegrations: subscriberOrgId => dispatch(requestIntegrations(subscriberOrgId)),
    integrateBox: subscriberOrgId => dispatch(integrateBox(subscriberOrgId)),
    integrateGoogle: subscriberOrgId => dispatch(integrateGoogle(subscriberOrgId)),
    revokeBox: subscriberOrgId => dispatch(revokeBox(subscriberOrgId)),
    revokeGoogle: subscriberOrgId => dispatch(revokeGoogle(subscriberOrgId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationDetailsPage);
