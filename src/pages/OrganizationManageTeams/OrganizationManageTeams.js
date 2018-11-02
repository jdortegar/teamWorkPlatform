import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import classNames from 'classnames';
import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { PageHeader, SimpleCardContainer, AvatarWithLabel, Spinner } from 'src/components';
import { Table, Tooltip, Input, Icon, Switch, message, Select, Form, Button } from 'antd';
import './styles/style.css';

const propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  orgData: PropTypes.object.isRequired,
  fetchDataSubscriberOrgs: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  updateTeam: PropTypes.func.isRequired,
  // users: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired
};

const { Option } = Select;

const renderTeamMembersLength = teamMembersLength => {
  if (teamMembersLength === 0) {
    return String.t('OrganizationManageTeams.teamMembersLength.noMembers', { count: teamMembersLength });
  } else if (teamMembersLength === 1) {
    return String.t('OrganizationManageTeams.teamMembersLength.oneMember', { count: teamMembersLength });
  } else if (teamMembersLength > 1) {
    return String.t('OrganizationManageTeams.teamMembersLength.manyMembers', { count: teamMembersLength });
  }

  return false;
};

class OrganizationManageTeams extends Component {
  constructor(props) {
    super(props);

    const { teams } = this.props;

    // New const for filter teams on search
    const teamsActive = teams || [];
    this.teamsActive = teamsActive;
    this.state = {
      teamsActive,
      orgDataLoaded: false,
      selectedTeams: [],
      selectValue: 'activate',
      selectedAll: false
    };

    // Bind this to functions
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchDataSubscriberOrgs(this.props.currentSubscriberOrgId)
      .then(() => this.setState({ orgDataLoaded: true }));
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.teams, nextProps.teams)) this.setState({ teamsActive: nextProps.teams });
  }

  // Handle Team Selector
  onToggleSelection(teamId) {
    const { orgData } = this.props;
    let { selectedTeams } = this.state;
    selectedTeams = _.xor(selectedTeams, [teamId]);

    const allTeams = orgData.teams.map(team => team.teamId);

    const selectedAll = selectedTeams.length === allTeams.length;
    this.setState({
      selectedTeams,
      selectedAll
    });
  }

  // Select all teams
  handleToggleAllOrgItem = () => {
    const { orgData } = this.props;

    const allTeams = orgData.teams.map(team => team.teamId);
    const selectedAll = this.state.selectedTeams.length === allTeams.length;

    this.setState({
      selectedAll: !selectedAll,
      selectedTeams: selectedAll ? [] : allTeams
    });
  };

  handleSubmit(event) {
    event.preventDefault();
    const { selectValue, selectedTeams } = this.state;
    const valuesToSend = { active: selectValue === 'activate' };
    const orgId = this.props.currentSubscriberOrgId;
    if (selectedTeams.length > 0) {
      // Update all teams
      Promise.all(selectedTeams.map(teamId => this.props.updateTeam(orgId, teamId, valuesToSend)))
        .then(() => {
          message.success(String.t('OrganizationManage.teamsUpdated'));
          this.setState({ selectedTeams: [] });
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  handleFormChange(value) {
    this.setState({ selectValue: value });
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

  // Handle Change status
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
    const { orgData } = this.props;
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
      const teamData = orgData.teams.find(teamEl => teamEl.teamId === team.teamId) || team;
      // const teamAdminData = team.teamMembers.find(member => member.role === 'admin');
      // const teamAdminName = teamAdminData && teamAdminData.userId ? users[teamAdminData.userId].fullName : '';
      return {
        key: index,
        team,
        teamMembersLength: teamData.teamMembers ? teamData.teamMembers.length : 1,
        creationDate: moment(team.created).format('LL'),
        status: {
          active: team.active,
          display: true,
          teamId: team.teamId
        },
        teamSelection: {
          teamId: team.teamId,
          isSelected: this.state.selectedTeams.some(teamId => teamId === team.teamId)
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
          title: String.t('name'),
          dataIndex: 'team',
          key: 'team',
          sorter: (a, b) => a.team.name.localeCompare(b.team.name),
          render: team => {
            if (!team) return false;
            return <AvatarWithLabel item={team} enabled={team.active} />;
          }
        },
        {
          title: String.t('teamMembers'),
          dataIndex: 'teamMembersLength',
          key: 'teamMembersLength',
          sorter: (a, b) => {
            const nameA = a.teamMembersLength.toString();
            const nameB = b.teamMembersLength.toString();
            return nameA.localeCompare(nameB, { numeric: true });
          },
          render: teamMembersLength => {
            if (!teamMembersLength) return false;
            return <span className="habla-table-label">{renderTeamMembersLength(teamMembersLength)}</span>;
          }
        },
        {
          title: String.t('creationDate'),
          dataIndex: 'creationDate',
          key: 'creationDate',
          sorter: (a, b) => new Date(a.creationDate) - new Date(b.creationDate),
          render: creationDate => {
            if (!creationDate) return false;
            return <span className="habla-table-label">{creationDate}</span>;
          }
        },
        {
          title: String.t('status'),
          dataIndex: 'status',
          key: 'status',
          width: 128,
          sorter: (a, b) => {
            const nameA = a.status.active ? 'true' : 'false';
            const nameB = b.status.active ? 'true' : 'false';
            return nameA.localeCompare(nameB); // eslint-disable-line consistent-return
          },
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
          title: String.t('edit'),
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
                      <i className="fas fa-pencil-alt fa-lg tagAsAButton" />
                    </span>
                  </div>
                }
              >
                <span>
                  <i className="fas fa-ellipsis-h fa-lg" />
                </span>
              </Tooltip>
            );
          }
        },
        {
          title: (
            <div className="tableTitle tagAsAButton" onClick={() => this.handleToggleAllOrgItem()}>
              {this.state.selectedAll ? String.t('deselectAll') : String.t('selectAll')}
            </div>
          ),
          key: 'teamSelection',
          dataIndex: 'teamSelection',
          width: 189,

          render: teamSelection => {
            if (!teamSelection.teamId) return false;
            return (
              <a
                onClick={event => {
                  event.stopPropagation();
                  this.onToggleSelection(teamSelection.teamId);
                }}
              >
                <Icon
                  type="check-circle"
                  theme="filled"
                  className={classNames('Tree__item-check-icon TeamPage__selectIcon', {
                    checked: teamSelection.isSelected
                  })}
                />
              </a>
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
              style: { backgroundColor: '#32a953' }
            }}
          />
          <SimpleCardContainer className="subpage-block subpage-block-actions padding-class-a">
            <div className="header-search-container">
              <Input
                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                onChange={this.handleSearch}
              />
              <div className="action__form">
                <Form onSubmit={this.handleSubmit}>
                  <Select
                    style={{ width: 120 }}
                    size="small"
                    className="action__form_select"
                    value={this.state.selectValue}
                    onChange={this.handleFormChange}
                  >
                    <Option value="activate">{String.t('activate')}</Option>
                    <Option value="deactivate">{String.t('deactivate')}</Option>
                  </Select>

                  <Button type="primary" size="small" className="action__form_button" htmlType="submit">
                    {String.t('apply')}
                  </Button>
                </Form>
              </div>
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
