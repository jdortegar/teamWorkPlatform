import { connect } from 'react-redux';
import IntegrationDetailsPage from '../../pages/IntegrationDetailsPage';
import {
  fetchIntegrations,
  integrateBox,
  integrateGoogle,
  integrateSharepoint,
  revokeBox,
  revokeGoogle,
  revokeSharepoint
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
    integrateBox: subscriberOrgId => dispatch(integrateBox(subscriberOrgId)),
    integrateGoogle: subscriberOrgId => dispatch(integrateGoogle(subscriberOrgId)),
    integrateSharepoint: (subscriberOrgId, sharepointOrg) => dispatch(integrateSharepoint(subscriberOrgId, sharepointOrg)),
    revokeBox: subscriberOrgId => dispatch(revokeBox(subscriberOrgId)),
    revokeGoogle: subscriberOrgId => dispatch(revokeGoogle(subscriberOrgId)),
    revokeSharepoint: subscriberOrgId => dispatch(revokeSharepoint(subscriberOrgId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationDetailsPage);
