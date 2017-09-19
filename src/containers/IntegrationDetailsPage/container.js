import { connect } from 'react-redux';
import IntegrationDetailsPage from '../../pages/IntegrationDetailsPage';
import { requestIntegrations, integrateBox, integrateGoogle } from '../../actions';

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
    integrateGoogle: subscriberOrgId => dispatch(integrateGoogle(subscriberOrgId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(IntegrationDetailsPage);
