import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchIntegrations } from 'src/actions';
import { getCurrentSubscriberOrgId, getCurrentSubscriberOrgName, getOrgIntegrations } from 'src/selectors';
import { IntegrationsPage } from 'src/pages';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    orgId,
    orgName: getCurrentSubscriberOrgName(state),
    integrations: getOrgIntegrations(state, orgId)
  };
};

const mapDispatchToProps = { fetchIntegrations };

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(IntegrationsPage)
);
