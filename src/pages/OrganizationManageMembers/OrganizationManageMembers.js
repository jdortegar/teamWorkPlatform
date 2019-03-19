import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import classNames from 'classnames';
import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { PageHeader, SimpleCardContainer, Spinner, AvatarWithLabel } from 'src/components';
import { Table, Tooltip, Input, Icon, Switch, Select, Form, Button, message } from 'antd';
import './styles/style.css';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.shape({
    currentSubscriberOrgId: PropTypes.string
  }).isRequired,
  users: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  usersPresences: PropTypes.object.isRequired,
  fetchSubscription: PropTypes.func.isRequired,
  subscriberOrg: PropTypes.object.isRequired
};

const { Option } = Select;

class OrganizationManageMembers extends Component {
  constructor(props) {
    super(props);

    const usersActive = Object.values(this.props.users).map(user => user.userId && user) || [];
    this.usersActive = usersActive;
    this.state = {
      usersActive,
      selectedTeamMembers: [],
      selectValue: 'activate',
      selectedAll: false,
      subscriptionLoaded: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchSubscription(this.props.subscriberOrg.stripeSubscriptionId).then(() => {
      this.setState({ subscriptionLoaded: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.users, nextProps.users))
      this.setState({ usersActive: Object.values(nextProps.users).map(user => user.userId && user) });
  }

  // Handle Team Selector
  onToggleSelection(teamMemberId) {
    const { users } = this.props;
    let { selectedTeamMembers } = this.state;
    selectedTeamMembers = _.xor(selectedTeamMembers, [teamMemberId]);

    const allMembers = Object.values(users).map(user => user.userId);

    const selectedAll = selectedTeamMembers.length === allMembers.length;
    this.setState({
      selectedTeamMembers,
      selectedAll
    });
  }

  // Select all teamMembers
  handleToggleAllOrgItem = () => {
    const { users } = this.props;
    const allMembers = Object.values(users).map(user => user.userId);
    const selectedAll = this.state.selectedTeamMembers.length === allMembers.length;

    this.setState({
      selectedAll: !selectedAll,
      selectedTeamMembers: selectedAll ? [] : allMembers
    });
  };

  // Switch function to enable / disable user.
  handleSubmit(event) {
    event.preventDefault();
    const { selectValue, selectedTeamMembers } = this.state;
    const valuesToSend = { active: selectValue === 'activate' };
    if (selectedTeamMembers.length > 0) {
      // Update all teams
      Promise.all(selectedTeamMembers.map(userId => this.props.updateUser(valuesToSend, userId)))
        .then(() => {
          message.success(String.t('OrganizationManageMembers.userUpdated'));
          this.setState({ selectedTeamMembers: [] });
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  // Switch function to enable / disable user.
  handleChangeStatus(checked, userId) {
    const valuesToSend = { active: checked };
    this.props
      .updateUser(valuesToSend, userId)
      .then(() => {
        message.success(String.t('OrganizationManageMembers.userUpdated'));
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  handleFormChange(value) {
    this.setState({ selectValue: value });
  }

  // Handle for search input
  handleSearch(e) {
    const { value } = e.target;
    if (value === '') {
      this.setState({ usersActive: this.usersActive });
    } else {
      const filteredUsers = this.state.usersActive.filter(user =>
        user.fullName.toLowerCase().includes(value.toLowerCase().trim())
      );
      this.setState({ usersActive: filteredUsers });
    }
  }

  // Get Users array
  renderUsers(usersActive) {
    const { match, usersPresences, subscriberOrg } = this.props;
    const { subscriberOrgId } = match.params;
    // If no users, no render
    if (usersActive.length === 0) {
      return null;
    }

    // Sort teams by Name
    let usersById = usersActive.sort(sortByName);
    usersById = usersById === 0 && usersById[0] === undefined ? [] : primaryAtTop(usersById);
    // Filter for don't show admin
    usersById = usersById.filter(user => !user.role || user.role !== 'admin');
    // Array to save users, 0 element is for add user button
    const userArray = usersById.map((user, index) => ({
      key: index + 1,
      user: {
        ...user,
        online: _.some(_.values(usersPresences[user.userId]), { presenceStatus: 'online' })
      },
      email: user.email,
      status: {
        active: user.enabled,
        display: true,
        userId: user.userId
      },
      editUser: user.userId,
      teamMemberSelection: {
        userId: user.userId,
        isSelected: this.state.selectedTeamMembers.some(userId => userId === user.userId)
      }
    }));

    // Add team button
    userArray.unshift({
      key: 0,
      user: {
        name: (
          <div>
            {String.t('OrganizationManageMembers.addNew')}
            <span className="MembersPage__membersLeft_badge">
              {String.t('OrganizationManageMembers.seatAvailables', {
                count: subscriberOrg.userLimit - this.state.usersActive.length || 0
              })}
            </span>
          </div>
        ),
        order: 'unorder',
        preferences: {
          logo: 'fa fa-plus'
        },
        editUrl: `/app/inviteNewMember/${subscriberOrgId}`,
        addButton: true
      },
      status: {
        enabled: false,
        active: false,
        order: 'unorder'
      }
    });

    return userArray;
  }

  render() {
    // General Consts
    const { users, match } = this.props;
    if (match && match.params && match.params.subscriberOrgId && users && this.state.subscriptionLoaded) {
      const { subscriberOrgId } = match.params;

      // Breadcrumb
      const pageBreadCrumb = {
        routes: [
          {
            title: String.t('OrganizationManageMembers.title')
          }
        ]
      };

      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-cog',
          title: 'OrganizationManage.manageTeams',
          url: `/app/editOrganization/${subscriberOrgId}/teams`
        },
        {
          icon: 'fas fa-cog',
          title: 'OrganizationManage.editOrganization',
          url: `/app/editOrganization/${subscriberOrgId}`
        },
        {
          icon: 'fas fa-cog',
          title: 'SurveyReportPage.menuTitle',
          url: `/app/surveyReport`
        },
        {
          icon: 'fas fa-cog',
          title: 'SurveySettingsPage.title',
          url: `/app/surveySettings`
        }
      ];

      // Table Columns
      const columns = [
        {
          title: String.t('name'),
          dataIndex: 'user',
          key: 'user',
          sorter: (a, b) => {
            if (a.user.order === 'unorder' || b.user.order === 'unorder') return;
            return a.user.firstName.localeCompare(b.user.firstName); // eslint-disable-line consistent-return
          },
          render: user => {
            if (!user) return false;
            return <AvatarWithLabel item={user} enabled={user.enabled} hasStatus={!user.addButton} />;
          }
        },
        {
          title: String.t('email'),
          dataIndex: 'email',
          key: 'email',
          render: email => {
            if (!email) return false;
            return <span className="habla-table-label">{email}</span>;
          }
        },
        {
          title: String.t('status'),
          dataIndex: 'status',
          key: 'status',
          width: 128,
          sorter: (a, b) => {
            if (a.status.order === 'unorder' || b.status.order === 'unorder') return;
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
                  status.enabled
                    ? String.t('OrganizationManageMembers.setInactive')
                    : String.t('OrganizationManageMembers.setActive')
                }
              >
                <Switch
                  checkedChildren={String.t('OrganizationManageMembers.activeState')}
                  unCheckedChildren={String.t('OrganizationManageMembers.inactiveState')}
                  onChange={checked => this.handleChangeStatus(checked, status.userId)}
                  checked={status.active}
                />
              </Tooltip>
            );
          }
        },
        {
          title: String.t('edit'),
          key: 'editUser',
          dataIndex: 'editUser',
          render: editUserId => {
            if (!editUserId) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => this.props.history.push(`/app/editTeamMember/${editUserId}`)}>
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
          key: 'teamMemberSelection',
          dataIndex: 'teamMemberSelection',
          width: 189,
          render: teamMemberSelection => {
            if (!teamMemberSelection) return false;
            return (
              <a
                onClick={event => {
                  event.stopPropagation();
                  this.onToggleSelection(teamMemberSelection.userId);
                }}
              >
                <Icon
                  type="check-circle"
                  theme="filled"
                  className={classNames('Tree__item-check-icon TeamPage__selectIcon', {
                    checked: teamMemberSelection.isSelected
                  })}
                />
              </a>
            );
          }
        }
      ];

      return (
        <div className="editOrgPage-main Organization_Members_Page">
          <PageHeader
            pageBreadCrumb={pageBreadCrumb}
            hasMenu
            backButton
            menuName="settings"
            menuPageHeader={menuPageHeader}
            badgeOptions={{
              enabled: true,
              count: this.state.usersActive.length - 1,
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
              <Table columns={columns} dataSource={this.renderUsers(this.state.usersActive)} pagination={false} />
            </div>
          </SimpleCardContainer>
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationManageMembers.propTypes = propTypes;

export default OrganizationManageMembers;
