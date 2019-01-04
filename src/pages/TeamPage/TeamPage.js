import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { paths } from 'src/routes';
import { CKG } from 'src/containers';
import { Spinner, ChatContent } from 'src/components';
import { CKG_VIEWS } from 'src/actions';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  org: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
  teamId: PropTypes.string.isRequired,
  userRoles: PropTypes.object,
  fetchTeamMembers: PropTypes.func.isRequired,
  makeTeamCall: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const defaultProps = {
  userRoles: {}
};

class TeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatVisible: true,
      ckgVisible: true,
      teamMembersLoaded: false
    };

    this.showChat = this.showChat.bind(this);
    this.showCKG = this.showCKG.bind(this);
  }

  componentDidMount = () => {
    if (!this.props.teamId) {
      this.props.history.replace(paths.app);
    }

    this.props.fetchTeamMembers(this.props.teamId).then(() => this.setState({ teamMembersLoaded: true }));
  };

  showChat(ckgState) {
    this.setState({
      chatVisible: true,
      ckgVisible: ckgState
    });
  }

  showCKG(chatState) {
    this.setState({
      ckgVisible: true,
      chatVisible: chatState
    });
  }

  render() {
    const { team, org, userRoles, user } = this.props;
    const { chatVisible, ckgVisible, teamMembersLoaded } = this.state;

    if (!teamMembersLoaded || !team || !org) {
      return <Spinner />;
    }

    // Page Menu
    const menuPageHeader = [
      {
        icon: 'fas fa-chart-area',
        title: 'graphViewsSelector.timeActivity',
        url: `/app/team/${team.teamId}#${CKG_VIEWS.TIME_ACTIVITY}`
      },
      {
        icon: 'fas fa-list-ul',
        title: 'graphViewsSelector.smartListView',
        url: `/app/team/${team.teamId}#${CKG_VIEWS.FILE_LIST}`
      },
      {
        icon: 'fas fa-chart-bar',
        title: 'graphViewsSelector.dashboard',
        url: '',
        submenu: [
          {
            title: 'graphViewsSelector.industryLabel',
            url: '',
            className: 'submenuTitle'
          },
          {
            icon: 'fas fa-chart-bar',
            title: 'graphViewsSelector.electronics',
            url: '#',
            className: 'disabled'
          },
          {
            icon: 'fas fa-chart-bar',
            title: 'graphViewsSelector.cpg',
            url: '#',
            className: 'disabled'
          },
          {
            icon: 'fas fa-chart-bar',
            title: 'graphViewsSelector.manufacturing',
            url: '/app/dashboard'
          },
          {
            icon: 'fas fa-chart-bar',
            title: 'graphViewsSelector.retail',
            url: '#',
            className: 'disabled'
          },
          {
            icon: 'fas fa-chart-bar',
            title: 'graphViewsSelector.relationshipHeatMap',
            url: '#',
            className: 'disabled'
          }
        ]
      },
      {
        title: 'TeamPage.teamSettings',
        url: '',
        className: 'submenuTitle'
      },
      {
        icon: 'fas fa-cloud-download-alt',
        title: 'TeamPage.addDataIntegration',
        url: `/app/teamIntegrations/${team.teamId}`
      },
      {
        icon: 'fa fa-phone',
        title: 'TeamPage.startVideoCall',
        onClick: () => {
          this.props.makeTeamCall(user.userId, team.teamId);
        }
      },
      {
        icon: 'fas fa-cog',
        title: 'TeamPage.manageTeam',
        url: `/app/team/manage/${team.teamId}`
      }
    ];

    if (userRoles.admin || userRoles.teamOwner.length > 0) {
      menuPageHeader.push({
        icon: 'fas fa-pencil-alt',
        title: 'TeamPage.editTeam',
        url: `/app/editTeam/${team.teamId}`
      });
    }
    if (userRoles.teamOwner.includes(team.teamId)) {
      menuPageHeader.splice(5, 0, {
        icon: 'fas fa-users',
        title: 'TeamPage.inviteNewMember',
        url: `/app/inviteToTeam/${team.teamId}`
      });
    }

    const chatClassName = classNames({
      'homePage__chat-container': true,
      'homepage_latest-container': chatVisible
    });

    const ckgClassName = classNames({
      'homepage_graph-container': true,
      'homepage_graph-container-height100': !ckgVisible
    });

    return (
      <div className="homePage-main">
        {chatVisible && (
          <div className={ckgClassName}>
            <CKG
              teamId={team.teamId}
              showSelector={false}
              menuOptions={menuPageHeader}
              showChat={this.showChat}
              showCKG={this.showCKG}
              chatVisible={this.state.ckgVisible}
            />
          </div>
        )}
        {ckgVisible && (
          <div className={chatClassName}>
            <ChatContent
              teamId={team.teamId}
              showTeamMembers={!chatVisible}
              showPageHeader={!chatVisible}
              showChat={this.showChat}
              menuOptions={menuPageHeader}
            />
          </div>
        )}
      </div>
    );
  }
}

TeamPage.propTypes = propTypes;
TeamPage.defaultProps = defaultProps;

export default TeamPage;
