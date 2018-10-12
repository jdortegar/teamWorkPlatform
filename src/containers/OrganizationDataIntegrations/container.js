import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchIntegrations, setCurrentSubscriberOrgId } from 'src/actions';
import { getCurrentUser, getCurrentSubscriberOrgId, getIntegrationsOfSubscriberOrgId } from 'src/selectors';

import { OrganizationDataIntegrations } from 'src/pages';

const mapStateToProps = state => ({
  subscriberOrgs: state.subscriberOrgs,
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  user: getCurrentUser(state),
  integrations: getIntegrationsOfSubscriberOrgId(state, state.subscriberOrgs.currentSubscriberOrgId)
});

const mapDispatchToProps = {
  fetchIntegrations,
  setCurrentSubscriberOrgId
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationDataIntegrations)
);
