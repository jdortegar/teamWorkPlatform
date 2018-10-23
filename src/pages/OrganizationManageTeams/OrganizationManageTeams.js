import React, { Component } from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { PageHeader, SimpleCardContainer, AvatarWithLabel, Spinner } from 'src/components';
import { Table, Tooltip, Input, Icon, Switch, message } from 'antd';
import './styles/style.css';

const propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  orgData: PropTypes.object.isRequired,
  fetchDataSubscriberOrgs: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  updateTeam: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired
};

class OrganizationManageTeams extends Component {
  constructor(props) {
    super(props);

    const { orgData } = this.props;

    // New const for filter teams on search
    const teamsActive = orgData.teams || [];
    this.teamsActive = teamsActive;
    this.state = {
      teamsActive,
      orgDataLoaded: false
    };

    // Bind this to functions
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchDataSubscriberOrgs(this.props.currentSubscriberOrgId)
      .then(() => this.setState({ orgDataLoaded: true }));
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

  handleChangeStatus(checked, teamId) {
    const valuesToSend = { active: checked };
    const subscriberOrgId = this.props.currentSubscriberOrgId;

    this.props
      .updateTeam(subscriberOrgId, teamId, valuesToSend)
      .then(() => {
        message.success(String.t('editTeamPage.teamUpdated'));
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          message.error(String.t('editTeamPage.errorNameAlreadyTaken'));
        } else {
          message.error(error.message);
        }
      });
  }

  // Get team array
  renderTeams(teamsActive) {
    const { users, teams } = this.props;
    // const subscriberOrgId = this.props.currentSubscriberOrgId;
    // If no teams, no render
    if (!teamsActive || teamsActive.length === 0) {
      return null;
    }

    // Sort teams by Name
    let teamsByOrgId = teamsActive.sort(sortByName);
    teamsByOrgId = teamsByOrgId.length === 0 && teamsByOrgId[0] === undefined ? [] : primaryAtTop(teamsByOrgId);

    // Array to save teams, 0 element is for add team button
    const teamArray = teamsByOrgId.map((team, index) => {
      const teamData = teams.find(teamEl => teamEl.teamId === team.teamId) || team;
      const teamAdminData = team.teamMembers.find(member => member.role === 'admin');
      const teamAdminName = teamAdminData && teamAdminData.userId ? users[teamAdminData.userId].fullName : '';
      return {
        key: index,
        team: teamData,
        teamAdminName,
        status: {
          active: teamData.active,
          display: true,
          teamId: teamData.teamId
        }
      };
    });

    // Add team button
    // teamArray.unshift({
    //   key: 0,
    //   team: {
    //     name: String.t('OrganizationManageTeams.addNew'),
    //     preferences: {
    //       logo: 'fa fa-plus'
    //     },
    //     editUrl: `/app/createTeam/${subscriberOrgId}`
    //   },
    //   status: {
    //     show: false
    //   }
    // });

    return teamArray;
  }

  render() {
    if (this.state.orgDataLoaded && this.state.teamsActive) {
      // General Const
      const subscriberOrgId = this.props.currentSubscriberOrgId;

      // Breadcrumb
      const pageBreadCrumb = {
        routes: [
          {
            title: String.t('OrganizationManageTeams.title')
          }
        ]
      };
      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-cog',
          title: 'OrganizationManage.manageTeamMembers',
          url: `/app/editOrganization/${subscriberOrgId}/members`
        },
        {
          icon: 'fas fa-cog',
          title: 'OrganizationManage.editOrganization',
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
          dataIndex: 'teamAdminName',
          key: 'teamAdminName',
          render: teamAdminName => {
            if (!teamAdminName) return false;
            return <span className="habla-table-label">{teamAdminName}</span>;
          }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          render: status => {
            if (!status.display) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  status.active
                    ? String.t('OrganizationManageTeams.setInactive')
                    : String.t('OrganizationManageTeams.setActive')
                }
              >
                <Switch
                  checkedChildren={String.t('OrganizationManageTeams.activeState')}
                  unCheckedChildren={String.t('OrganizationManageTeams.inactiveState')}
                  onChange={checked => this.handleChangeStatus(checked, status.teamId)}
                  checked={status.active}
                />
              </Tooltip>
            );
          }
        },
        {
          title: 'Edit',
          key: 'editTeam',
          dataIndex: 'team',
          render: team => {
            if (!team.teamId) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => this.props.history.push(`/app/editTeam/${team.teamId}`)}>
                      <i className="fas fa-pencil-alt fa-lg" />
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
            badgeOptions={{
              enabled: true,
              count: this.state.teamsActive.length,
              style: { backgroundColor: '#52c41a' }
            }}
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

export default OrganizationManageTeams;
