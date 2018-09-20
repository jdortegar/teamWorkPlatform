import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchIntegrations, integrateIntegration } from 'src/actions';
import { IntegrationsPage } from 'src/pages';

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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IntegrationsPage)
);
