import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { PageHeader, SimpleCardContainer } from 'src/components';
import { TeamCallButton } from 'src/containers';
import String from 'src/translations';
import { sortByFirstName } from 'src/redux-hablaai/selectors/helpers';
import FilterUserMessages from './FilterUserMessages';

import './styles/style.css';

const propTypes = {
  conversation: PropTypes.object,
  menuOptions: PropTypes.array,
  showPageHeader: PropTypes.bool,
  showTeamMembers: PropTypes.bool,
  showChat: PropTypes.func,
  user: PropTypes.object.isRequired,
  onOwnerFilterClick: PropTypes.func.isRequired,
  members: PropTypes.array.isRequired,
  membersFiltered: PropTypes.array.isRequired,
  team: PropTypes.object.isRequired
};

const defaultProps = {
  conversation: {},
  menuOptions: [],
  showPageHeader: false,
  showTeamMembers: false,
  showChat: null
};

class TopBar extends React.Component {
  messagesCounter() {
    const { conversation, membersFiltered } = this.props;
    if (!membersFiltered) return 0;
    const messages = conversation.messages.map(message => {
      if (message.deleted) return null;
      const createdBy = membersFiltered.find(member => member.userId === message.createdBy);
      if (!createdBy) return null;
      return message;
    });
    return messages.filter(mes => mes).length;
  }

  renderTeamMembers() {
    const { user, members } = this.props;

    // Order Members, current user always first
    const otherMembers = _.reject(members, { userId: user.userId });
    const orderedMembers = otherMembers.sort(sortByFirstName);

    return (
      <FilterUserMessages
        owners={[user, ...orderedMembers]}
        onOwnerFilterClick={this.props.onOwnerFilterClick}
        excludeOwnersFilter={this.props.membersFiltered}
        className="CKGPage__FilesFilters"
        showTooltip={false}
      />
    );
  }

  render() {
    const { team, showPageHeader, showTeamMembers, menuOptions } = this.props;

    return (
      <div>
        {showPageHeader && (
          <PageHeader
            pageBreadCrumb={{
              routes: [
                {
                  title: team.name,
                  link: `/app/team/${team.teamId}`
                },
                { title: String.t('chat.title') }
              ]
            }}
            badgeOptions={{
              enabled: true,
              count: this.messagesCounter(),
              style: { backgroundColor: '#32a953' }
            }}
            hasMenu
            menuName="settings"
            menuPageHeader={menuOptions}
          />
        )}
        {showTeamMembers && (
          <SimpleCardContainer className="Chat_Header">
            <div className="Chat_members_container">{this.renderTeamMembers()}</div>
            <div className="Chat_Header_right_buttons">
              <div className="Chat_videoCall_container">
                <TeamCallButton />
              </div>
              <div className="Chat_expandAction" onClick={() => this.props.showChat(true)}>
                <i className="fas fa-angle-down" />
              </div>
            </div>
          </SimpleCardContainer>
        )}
      </div>
    );
  }
}

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
