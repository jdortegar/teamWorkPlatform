import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import IntegrationsPage from '../../pages/IntegrationsPage';
import { requestIntegrations, integrateBox, integrateGoogle } from '../../actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestIntegrations: subscriberOrgId => dispatch(requestIntegrations(subscriberOrgId)),
    integrateBox: subscriberOrgId => dispatch(integrateBox(subscriberOrgId)),
    integrateGoogle: subscriberOrgId => dispatch(integrateGoogle(subscriberOrgId))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntegrationsPage));
