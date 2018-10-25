import React, { Component } from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import TeamItem from './TeamItem';
import TeamMemberItem from './TeamMemberItem';
import MemberIntegrationItem from './MemberIntegrationItem';
import './styles/style.css';

const propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  updateTeam: PropTypes.func.isRequired,
  updateTeamMember: PropTypes.func.isRequired,
  orgData: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  // Selected Items
  selectedTeams: PropTypes.array.isRequired,
  selectedTeamMembers: PropTypes.array.isRequired,
  selectedMemberIntegrations: PropTypes.array.isRequired,
  // Toggle Events
  onToggleSelect: PropTypes.func.isRequired,
  revokeIntegration: PropTypes.func.isRequired
};

class TreeOrganization extends Component {
  // On select Team
  toggleTeamSelection = teamId => {
    const orgId = this.props.currentSubscriberOrgId;
    this.props.onToggleSelect({ type: 'team', team: { id: teamId, teamId, orgId } });
  };

  // On select Team Member
  toggleTeamMemberSelection = (userId, teamId) => {
    const orgId = this.props.currentSubscriberOrgId;
    this.props.onToggleSelect({ type: 'teamMember', teamMember: { id: teamId, userId, teamId, orgId } });
  };

  // On select Member Integration
  toggleMemberIntegrationSelection = memberIntegration => {
    this.props.onToggleSelect({ type: 'memberIntegration', memberIntegration });
  };

  renderTeams = (orgData, users, teams) => {
    const { selectedTeams } = this.props;
    return orgData.teams.map(team => {
      const teamData = teams.find(teamEl => teamEl.teamId === team.teamId) || team;
      // const teamAdminData = team.teamMembers.find(member => member.role === 'admin');
      // const teamAdminName = users[teamAdminData.userId].fullName;
      const isSelected = selectedTeams.some(teamEl => teamEl.teamId === team.teamId);
      return (
        <TeamItem
          key={team.teamId}
          team={teamData}
          teamMembersLength={team.teamMembers.length}
          orgId={this.props.currentSubscriberOrgId}
          updateTeam={this.props.updateTeam}
          isSelected={isSelected}
          onToggleSelection={this.toggleTeamSelection}
        >
          <span className="habla-label habla-bold-text">{String.t('OrganizationManage.teamMembers')}</span>
          {this.renderTeamMembers(team.teamMembers, team.teamId, users)}
        </TeamItem>
      );
    });
  };

  renderTeamMembers = (teamMembers, teamId, users) => {
    const { selectedTeamMembers } = this.props;

    return teamMembers.map(teamMember => {
      const memberData = { ...users[teamMember.userId], active: teamMember.active };
      const isSelected = selectedTeamMembers.some(
        teamMemberEl => teamMemberEl.userId === teamMember.userId && teamMemberEl.teamId === teamId
      );
      return (
        <TeamMemberItem
          key={teamMember.userId}
          orgId={this.props.currentSubscriberOrgId}
          teamMember={memberData}
          teamId={teamId}
          updateTeamMember={this.props.updateTeamMember}
          isSelected={isSelected}
          onToggleSelection={this.toggleTeamMemberSelection}
        >
          <span className="habla-label habla-bold-text">{String.t('OrganizationManage.dataIntegrations')}</span>
          {/* {this.renderMemberIntegrations(teamMember.integrations)} */}
        </TeamMemberItem>
      );
    });
  };

  renderMemberIntegrations = memberIntegrations => {
    const { selectedMemberIntegrations } = this.props;
    const integrationData = Object.entries(memberIntegrations).map(([key, value]) => ({ ...value, key }));
    return integrationData.map(memberIntegration => {
      const isSelected = selectedMemberIntegrations.some(
        memberIntegrationsEl => memberIntegrationsEl.userId === memberIntegration.userId
      );
      return (
        <MemberIntegrationItem
          revokeIntegration={this.props.revokeIntegration}
          key={memberIntegration.userId}
          memberIntegration={memberIntegration}
          isSelected={isSelected}
          onToggleSelection={this.toggleMemberIntegrationSelection}
        />
      );
    });
  };

  renderTree = (orgData, users, teams) => <div>{this.renderTeams(orgData, users, teams)}</div>;

  render() {
    const { orgData, users, teams } = this.props;
    return <div className="Tree">{this.renderTree(orgData, users, teams)}</div>;
  }
}

TreeOrganization.propTypes = propTypes;

export default TreeOrganization;
