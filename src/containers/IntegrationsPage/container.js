import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import IntegrationsPage from '../../pages/IntegrationsPage';
import { fetchIntegrations, integrateBox, integrateGoogle, integrateSharepoint } from '../../actions';

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
    integrateSharepoint: (subscriberOrgId, sharepointOrg) => dispatch(integrateSharepoint(subscriberOrgId, sharepointOrg))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntegrationsPage));
