import { connect } from 'react-redux';
import { toggleSideBar, fetchScheduleMessages } from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrg,
  getSchedulesById,
  getConversationIdsByTeam,
  getConversationIdsByMember,
  getOrgSubscribers,
  getOrgTeams,
  getConversationIds
} from 'src/selectors';
import { NotificationsPage } from 'src/pages';

const mapStateToProps = state => {
  return {
    user: getCurrentUser(state),
    sideBarIsHidden: state.sideBar.hidden,
    org: getCurrentSubscriberOrg(state),
    scheduleMessages: getSchedulesById(state),
    conversationIdsByTeam: getConversationIdsByTeam(state),
    conversationIdsByMember: getConversationIdsByMember(state),
    subscribers: getOrgSubscribers(state),
    teams: getOrgTeams(state),
    conversationIds: getConversationIds(state)
  };
};

const mapDispatchToProps = {
  fetchScheduleMessages,
  toggleSideBar
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsPage);
