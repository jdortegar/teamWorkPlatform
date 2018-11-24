import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchIntegrations } from 'src/actions';
import { getCurrentUser, getCurrentSubscriberOrgId, getOrgIntegrationsObj } from 'src/selectors';

import { OrganizationDataIntegrations } from 'src/pages';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    orgId,
    subscriberOrgs: state.subscriberOrgs,
    user: getCurrentUser(state),
    integrations: getOrgIntegrationsObj(state, orgId)
  };
};

const mapDispatchToProps = { fetchIntegrations };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationDataIntegrations)
);
