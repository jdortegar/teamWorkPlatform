import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { PageHeader, SimpleCardContainer } from 'src/components';
import { Table, Tooltip, Input, Icon, Divider, Switch } from 'antd';
import Avatar from 'src/components/common/Avatar';
import './styles/style.css';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  teams: PropTypes.array,
  // updateTeam: PropTypes.func.isRequired,
  currentSubscriberOrgId: PropTypes.string,
  user: PropTypes.object.isRequired
};

const defaultProps = {
  currentSubscriberOrgId: null,
  teams: []
};

function renderAvatar(item, enabled) {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': !enabled
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} />;
  }
  const nameInitial = item.name.substring(0, 1).toUpperCase();
  return (
    <Avatar color={preferences.iconColor} className={className}>
      {nameInitial}
    </Avatar>
  );
}

class OrganizationManageTeams extends Component {
  constructor(props) {
    super(props);

    const { teams, currentSubscriberOrgId } = this.props;
    const teamsActive = teams.filter(team => team.subscriberOrgId === currentSubscriberOrgId && team.active);

    this.teamsActive = teamsActive;

    this.state = {
      teamsActive
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  // Handle for search input
  handleSearch(e) {
    const { value } = e.target;
    if (value === '') {
      this.setState({ teamsActive: this.teamsActive });
    } else {
      const filteredTeams = this.state.teamsActive.filter(el =>
        el.name.toLowerCase().includes(value.toLowerCase().trim())
      );
      this.setState({ teamsActive: filteredTeams });
    }
  }

  // Handle functions for edit
  handleEditTeam(action, teamId) {
    if (action === 'editTeam') {
      this.props.history.push(`/app/editTeam/${teamId}`);
      return true;
    }
    return true;
  }

  // Handle for team manage form
  // handleChangeStatus(teamId, e) {
  //   const valuesToSend = {};
  //   if (e) {
  //     valuesToSend.active = true;
  //   } else {
  //     valuesToSend.active = false;
  //   }
  //   this.props
  //     .updateTeam(valuesToSend, teamId)
  //     .then(() => {
  //       message.success(String.t('editTeamPage.teamUpdated'));
  //     })
  //     .catch(error => {
  //       if (error.response && error.response.status === 409) {
  //         message.error(String.t('editTeamPage.errorNameAlreadyTaken'));
  //       } else {
  //         message.error(error.message);
  //       }
  //     });
  // }

  // Get team array
  renderTeams(teamsActive) {
    const { user } = this.props;
    if (teamsActive.length === 0) {
      return null;
    }

    let teamsByOrgId = teamsActive.sort(sortByName);

    teamsByOrgId = teamsByOrgId.length === 0 && teamsByOrgId[0] === undefined ? [] : primaryAtTop(teamsByOrgId);

    return teamsByOrgId.map((teamEl, index) => {
      let isAdmin = false;
      if (teamEl.teamMembers) {
        const teamMemberFoundByUser = _.find(teamEl.teamMembers, { userId: user.userId });
        isAdmin = teamMemberFoundByUser.teams[teamEl.teamId].role === 'admin';
      }
      if (!isAdmin && (!teamEl.active || teamEl.deleted)) {
        return null;
      }
      return {
        key: index,
        team: teamEl,
        owner: teamEl.owner,
        status: {
          enabled: teamEl.active,
          teamId: teamEl.teamId
        },
        editTeam: teamEl.teamId
      };
    });
  }

  render() {
    // General Consts
    const { match } = this.props;
    const { subscriberOrgId } = match.params;
    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('OrganizationPage.title')
        },
        {
          title: String.t('OrganizationManageteams.title', { count: this.state.teamsActive.length })
        }
      ]
    };
    // Page Menu
    const menuPageHeader = [
      {
        icon: 'fas fa-pencil-alt',
        title: 'OrganizationPage.editSection',
        url: `/app/editOrganization/${subscriberOrgId}`
      }
    ];

    // Table Columns
    const columns = [
      {
        title: 'NAME',
        dataIndex: 'team',
        key: 'team',
        render: team => (
          <div className="table-team-container">
            {renderAvatar(team, team.active)}
            <span className="habla-table-label">{team.name}</span>
          </div>
        )
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        render: ownerId => <span className="habla-table-label">{ownerId}</span>
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: status => (
          <Tooltip
            placement="top"
            title={
              status.enabled
                ? String.t('OrganizationManageteams.setInactive')
                : String.t('OrganizationManageteams.setActive')
            }
          >
            <Switch
              checkedChildren={String.t('OrganizationManageteams.activeState')}
              unCheckedChildren={String.t('OrganizationManageteams.inactiveState')}
              // onChange={e => this.handleChangeStatus(status.teamId, e)}
              checked={status.enabled}
            />
          </Tooltip>
        )
      },
      {
        title: 'Edit',
        key: 'editTeam',
        dataIndex: 'editTeam',
        render: teamEditId => (
          <Tooltip
            placement="top"
            title={
              <div>
                <span onClick={() => this.handleEditTeam('editTeam', teamEditId)}>
                  <i className="fas fa-pencil-alt fa-lg" />
                </span>
                <Divider type="vertical" style={{ height: '20px' }} />
                <span onClick={() => this.handleEditTeam('deleteTeam', teamEditId)}>
                  <i className="fas fa-times fa-lg" />
                </span>
              </div>
            }
          >
            <span className="p-1">
              <i className="fas fa-ellipsis-h fa-lg" />
            </span>
          </Tooltip>
        )
      }
    ];

    return (
      <div className="editOrgPage-main">
        <PageHeader
          pageBreadCrumb={pageBreadCrumb}
          hasMenu
          menuName="settings"
          menuPageHeader={menuPageHeader}
          backButton={`/app/organization/${subscriberOrgId}`}
        />
        <SimpleCardContainer className="subpage-block habla-color-lighertblue padding-class-a">
          <div className="header-search-container">
            <Input prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.handleSearch} />
          </div>
        </SimpleCardContainer>
        <SimpleCardContainer className="subpage-block p-0">
          <div className="table-container">
            <Table columns={columns} dataSource={this.renderTeams(this.state.teamsActive)} pagination={false} />
          </div>
        </SimpleCardContainer>
      </div>
    );
  }
}

OrganizationManageTeams.propTypes = propTypes;
OrganizationManageTeams.defaultProps = defaultProps;

export default OrganizationManageTeams;
