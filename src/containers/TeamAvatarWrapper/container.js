import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { TeamAvatarWrapper } from 'src/components';
import { makeTeamCall, fetchPublicTeamMembers, requestJoinToTeam } from 'src/actions';
import { getCurrentUser, getTeamMembersOfTeamId, getUserByUserId } from 'src/selectors';

const mapStateToProps = (state, props) => {
  const { teamId, teamAdmin } = props.team;
  const users = getUserByUserId(state);
  const teamAdminName = users[teamAdmin] ? users[teamAdmin].fullName : null;
  return {
    currentUser: getCurrentUser(state),
    teamMembers: getTeamMembersOfTeamId(state, teamId),
    teamAdminName
  };
};

const mapDispatchToProps = {
  makeTeamCall,
  fetchPublicTeamMembers,
  requestJoinToTeam
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamAvatarWrapper)
);
