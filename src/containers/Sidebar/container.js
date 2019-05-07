import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Sidebar } from 'src/components';
import { setCurrentSubscriberOrgId, showSideBar, finishCall, readMessage, fetchTeamMembers } from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSubscriberOrgsSortedAlphabetically,
  getOrgSubscribers,
  getPresencesOfSubscribersOfOrgId,
  getUserRoles,
  getCallingData,
  getStatusCall,
  getPersonalConversationUnreadMessages,
  getConversationIdsByTeam,
  getConversationIdsByMember,
  getReadMessagesByConversationId,
  getConversationsById,
  getCurrentUserTeams
} from 'src/selectors';

const mapStateToProps = (state, props) => {
  const orgId = getCurrentSubscriberOrgId(state);
  let teamId;
  if (props.location.pathname.indexOf('/team/') > 0) {
    teamId = props.location.pathname.split('team/')[1].split('/')[0];
  }
  return {
    user: getCurrentUser(state),
    subscriberOrgs: getSubscriberOrgsSortedAlphabetically(state),
    subscribers: getOrgSubscribers(state),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    currentSubscriberOrgId: orgId,
    teams: getCurrentUserTeams(state),
    sideBarIsHidden: state.sideBar.hidden,
    userRoles: getUserRoles(state),
    teamId,
    callingData: getCallingData(state),
    statusCall: getStatusCall(state),
    personalConversationUnreadMessages: getPersonalConversationUnreadMessages(state),
    conversationIdsByTeam: getConversationIdsByTeam(state),
    readMessagesByConversationId: getReadMessagesByConversationId(state),
    conversations: getConversationsById(state),
    personalConversations: getConversationIdsByMember(state)
  };
};

const mapDispatchToProps = {
  setCurrentSubscriberOrgId,
  showSideBar,
  finishCall,
  readMessage,
  fetchTeamMembers
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
