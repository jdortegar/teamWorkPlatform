import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchDataSubscriberOrgs,
  updateTeam,
  updateTeamMember
} from 'src/actions';
import {
  getSubscriberOrgsSortedAlphabetically,
  getOrgData,
  getCurrentSubscriberOrgId,
  getUserByUserId
} from 'src/selectors';
import { OrganizationManage } from 'src/pages';

const mapStateToProps = state => ({
  subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
  orgData: getOrgData(state),
  currentSubscriberOrgId: getCurrentSubscriberOrgId(state),
  users: getUserByUserId(state)
});

const mapDispatchToProps = {
  fetchSubscribersBySubscriberOrgId,
  fetchIntegrations,
  setCurrentSubscriberOrgId,
  fetchDataSubscriberOrgs,
  updateTeam,
  updateTeamMember
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrganizationManage)
);
