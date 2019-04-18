import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Sidebar } from 'src/components';
import {
  setCurrentSubscriberOrgId,
  showSideBar,
  finishCall,
  readMessage,
  fetchTeamMembers,
  createConversation
} from 'src/actions';
import {
  getCurrentUser,
  getCurrentSubscriberOrgId,
  getSubscriberOrgsSortedAlphabetically,
  getOrgTeams,
  getSubscribersOfSubscriberOrgId,
  getPresencesOfSubscribersOfOrgId,
  getUserRoles,
  getCallingData,
  getStatusCall,
  getPersonalConversationUnreadMessages,
  getConversationIdsByTeam,
  getConversationIdsByMember,
  getReadMessagesByConversationId,
  getConversationsById
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
    subscribers: getSubscribersOfSubscriberOrgId(state, orgId),
    subscribersPresences: getPresencesOfSubscribersOfOrgId(state, orgId),
    currentSubscriberOrgId: orgId,
    teams: getOrgTeams(state),
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
  fetchTeamMembers,
  createConversation
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Sidebar)
);
