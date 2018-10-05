import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { PageHeader, SimpleCardContainer, AvatarWithLabel, Spinner } from 'src/components';
import { Table, Tooltip, Input, Icon, Divider, Switch } from 'antd';
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

class OrganizationManageTeams extends Component {
  constructor(props) {
    super(props);
    const { teams, currentSubscriberOrgId } = this.props;

    // New const for filter teams on search
    const teamsActive = teams.filter(team => team.subscriberOrgId === currentSubscriberOrgId && team.active);
    this.teamsActive = teamsActive;
    this.state = {
      teamsActive
    };

    // Bind this to functions
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
    const { user, match } = this.props;
    const { subscriberOrgId } = match.params;

    // If no teams, no render
    if (teamsActive.length === 0) {
      return null;
    }

    // Sort teams by Name
    let teamsByOrgId = teamsActive.sort(sortByName);
    teamsByOrgId = teamsByOrgId.length === 0 && teamsByOrgId[0] === undefined ? [] : primaryAtTop(teamsByOrgId);

    // Array to save teams, 0 element is for add team button
    const teamArray = teamsByOrgId.map((teamEl, index) => {
      let isAdmin = false;
      if (teamEl.teamMembers) {
        const teamMemberFoundByUser = _.find(teamEl.teamMembers, { userId: user.userId });
        isAdmin = teamMemberFoundByUser.teams[teamEl.teamId].role === 'admin';
      }
      if (!isAdmin && (!teamEl.active || teamEl.deleted)) {
        return null;
      }
      return {
        key: index + 1,
        team: teamEl,
        owner: teamEl.owner,
        status: {
          enabled: teamEl.active,
          teamId: teamEl.teamId
        },
        editTeam: teamEl.teamId
      };
    });

    // Add team button
    teamArray.unshift({
      key: 0,
      team: {
        name: String.t('OrganizationManageTeams.addNew'),
        preferences: {
          logo: 'fa fa-plus'
        },
        editUrl: `/app/createTeam/${subscriberOrgId}`
      },
      status: {
        enabled: false
      }
    });

    return teamArray;
  }

  render() {
    // General Consts
    const { match } = this.props;
    const { subscriberOrgId } = match.params;
    if (match && match.params && match.params.subscriberOrgId && this.state.teamsActive) {
      // Breadcrumb
      const pageBreadCrumb = {
        routes: [
          {
            title: String.t('OrganizationPage.title')
          },
          {
            title: String.t('OrganizationManageTeams.title', { count: this.state.teamsActive.length })
          }
        ]
      };
      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-cog',
          title: 'OrganizationPage.manageTeamMembers',
          url: `/app/editOrganization/${subscriberOrgId}/members`
        },
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
          render: team => {
            if (!team) return false;
            return <AvatarWithLabel item={team} enabled={team.active} />;
          }
        },
        {
          title: 'Owner',
          dataIndex: 'owner',
          key: 'owner',
          render: ownerId => {
            if (!ownerId) return false;
            return <span className="habla-table-label">{ownerId}</span>;
          }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: status => {
            if (!status.enabled) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  status.enabled
                    ? String.t('OrganizationManageTeams.setInactive')
                    : String.t('OrganizationManageTeams.setActive')
                }
              >
                <Switch
                  checkedChildren={String.t('OrganizationManageTeams.activeState')}
                  unCheckedChildren={String.t('OrganizationManageTeams.inactiveState')}
                  // onChange={e => this.handleChangeStatus(status.teamId, e)}
                  checked={status.enabled}
                />
              </Tooltip>
            );
          }
        },
        {
          title: 'Edit',
          key: 'editTeam',
          dataIndex: 'editTeam',
          render: editTeamId => {
            if (!editTeamId) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => this.handleEditTeam('editTeam', editTeamId)}>
                      <i className="fas fa-pencil-alt fa-lg" />
                    </span>
                    <Divider type="vertical" style={{ height: '20px' }} />
                    <span onClick={() => this.handleEditTeam('deleteTeam', editTeamId)}>
                      <i className="fas fa-times fa-lg" />
                    </span>
                  </div>
                }
              >
                <span className="p-1">
                  <i className="fas fa-ellipsis-h fa-lg" />
                </span>
              </Tooltip>
            );
          }
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
              <Input
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.handleSearch}
              />
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
    return <Spinner />;
  }
}

OrganizationManageTeams.propTypes = propTypes;
OrganizationManageTeams.defaultProps = defaultProps;

export default OrganizationManageTeams;
