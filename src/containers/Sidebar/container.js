import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Sidebar } from 'src/components';
import { setCurrentSubscriberOrgId, showSideBar } from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSubscriberOrgsSortedAlphabetically,
  getOrgTeams,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId
} from 'src/selectors';

const mapStateToProps = state => {
  const orgId = getCurrentSubscriberOrgId(state);
  return {
    user: getCurrentUser(state),
    subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
    subscribers: getSubscribersOfSubscriberOrgId(state, orgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    currentSubscriberOrgId: orgId,
    teams: getOrgTeams(state, orgId),
    sideBarIsHidden: state.sideBar.hidden
  };
};

const mapDispatchToProps = {
  setCurrentSubscriberOrgId,
  showSideBar
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
