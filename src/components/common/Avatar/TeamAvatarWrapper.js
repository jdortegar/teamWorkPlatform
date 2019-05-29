import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Popover, Menu, Divider } from 'antd';
import { PreviewMessageModal } from 'src/components';
import getInitials from 'src/utils/helpers';
import String from 'src/translations';
import Avatar from './Avatar';

const propTypes = {
  currentUser: PropTypes.object,
  team: PropTypes.object.isRequired,
  teamMembers: PropTypes.array,
  fetchPublicTeamMembers: PropTypes.func,
  requestJoinToTeam: PropTypes.func,
  makeTeamCall: PropTypes.func,
  showDetails: PropTypes.bool,
  teamAdminName: PropTypes.string,
  size: PropTypes.string
};

const defaultProps = {
  showDetails: true,
  currentUser: null,
  teamMembers: [],
  teamAdminName: null,
  fetchPublicTeamMembers: () => {},
  requestJoinToTeam: () => {},
  makeTeamCall: () => {},
  size: 'default'
};

function renderAvatar(item, enabled, size = 'default') {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': !enabled
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} size={size} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} size={size} />;
  }
  const nameInitial = getInitials(item.name);
  return (
    <Avatar color={preferences.iconColor} className={className} size={size}>
      {nameInitial}
    </Avatar>
  );
}

class TeamAvatarWrapper extends React.Component {
  state = {
    previewMessageModalVisible: false
  };

  componentWillMount() {
    const { team } = this.props;
    if (team && team.teamId) {
      this.props.fetchPublicTeamMembers(team.teamId);
    }
  }

  handleVideoCall = () => {
    const { currentUser, team } = this.props;
    this.props.makeTeamCall(currentUser.userId, team.teamId);
  };

  showPreviewMessageModal = hide => {
    if (!hide) return this.setState({ previewMessageModalVisible: false });
    return this.setState({ previewMessageModalVisible: !this.state.previewMessageModalVisible });
  };

  renderContent = () => {
    const { team, teamMembers, currentUser, teamAdminName } = this.props;
    const { teamId } = team;
    const isMember = teamMembers.find(userId => userId === currentUser.userId);
    return (
      <div>
        <div className="Subscriber__Tooltip_Header">
          <div className="Subscriber__Tooltip_MainInfo">
            <TeamAvatarWrapper size="default" team={team} hideStatusTooltip showDetails={false} />
            <div className="Subscriber__Tooltip_Text">
              <span className="Subscriber__Tooltip_Name">{team.name}</span>
              {teamMembers.length > 0 && (
                <span className="Subscriber__Tooltip_Status habla-soft-grey">
                  {String.t('teamAvatarWrapper.teamAdminName', { teamAdminName })}
                </span>
              )}
            </div>
          </div>
          <Divider style={{ margin: '10px auto 5px', background: '#7d7d7d' }} />
          <div className="Subscriber__Tooltip_ExtraInfo">
            <span className="Subscriber__Tooltip_DisplayName habla-soft-grey">
              {teamMembers.length === 1
                ? String.t('teamAvatarWrapper.teamMember')
                : String.t('teamAvatarWrapper.teamMembers', { teamMembers: teamMembers.length })}
            </span>
          </div>
        </div>

        <Menu mode="vertical" className="pageHeaderMenu">
          {isMember && (
            <Menu.Item key={team.teamId}>
              <span onClick={() => this.handleVideoCall()}>
                <i className="fa fa-phone" /> {String.t('teamAvatarWrapper.videoCall')}
              </span>
            </Menu.Item>
          )}
          {!isMember && (
            <Menu.Item key={`${teamId}-request`}>
              <span onClick={() => this.showPreviewMessageModal(true)}>
                <i className="fas fa-sign-in-alt" /> {String.t('teamAvatarWrapper.request')}
              </span>
            </Menu.Item>
          )}
        </Menu>
      </div>
    );
  };

  renderPreview = () => {
    const { team, teamMembers, teamAdminName } = this.props;

    return (
      <div>
        <div className="Subscriber__Tooltip_Header">
          <div className="Subscriber__Tooltip_MainInfo">
            <TeamAvatarWrapper size="default" team={team} hideStatusTooltip showDetails={false} />
            <div className="Subscriber__Tooltip_Text">
              <span className="Subscriber__Tooltip_Name" style={{ color: '#000' }}>
                {team.name}
              </span>
              {teamMembers.length > 0 && (
                <span className="Subscriber__Tooltip_Status habla-soft-grey">
                  {String.t('teamAvatarWrapper.teamAdminName', { teamAdminName })}
                </span>
              )}
            </div>
          </div>
          <Divider style={{ margin: '10px auto 5px', background: '#7d7d7d' }} />
          <div className="Subscriber__Tooltip_ExtraInfo">
            <span className="Subscriber__Tooltip_DisplayName habla-soft-grey">
              {teamMembers.length === 1
                ? String.t('teamAvatarWrapper.teamMember')
                : String.t('teamAvatarWrapper.teamMembers', { teamMembers: teamMembers.length })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { team, showDetails, currentUser, size } = this.props;
    if (!team) return null;
    return (
      <div>
        {showDetails ? (
          <Popover key={team.teamId} placement="topLeft" content={this.renderContent()} trigger="hover">
            <div>{renderAvatar(team, team.active, size)}</div>
          </Popover>
        ) : (
          <div>{renderAvatar(team, team.active, size)}</div>
        )}
        {this.state.previewMessageModalVisible && (
          <PreviewMessageModal
            title="Request an Invitation Now"
            content={this.renderPreview()}
            visible={this.state.previewMessageModalVisible}
            showPreviewMessageModal={this.showPreviewMessageModal}
            okButton="Request"
            okButtonClass="Confirm_button"
            onConfirmed={() => {
              this.props.requestJoinToTeam(team.teamId, currentUser.userId);
              this.showPreviewMessageModal(false);
            }}
          />
        )}
      </div>
    );
  }
}

TeamAvatarWrapper.propTypes = propTypes;
TeamAvatarWrapper.defaultProps = defaultProps;

export default TeamAvatarWrapper;
