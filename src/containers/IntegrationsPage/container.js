import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import IntegrationsPage from '../../pages/IntegrationsPage';
import { fetchIntegrations, integrateIntegration } from '../../actions';

function mapStateToProps(state) {
  return {
    integrations: state.integrations,
    subscriberOrgs: state.subscriberOrgs
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchIntegrations: subscriberOrgId => dispatch(fetchIntegrations(subscriberOrgId)),
    integrateIntegration: (key, subscriberOrgId, params) => dispatch(integrateIntegration(key, subscriberOrgId, params))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntegrationsPage));
