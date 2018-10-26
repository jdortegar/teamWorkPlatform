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
  updateUser: PropTypes.func.isRequired
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
      selectedAll: false
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { match } = this.props;
    const { subscriberOrgId } = match.params;
    // If no users, no render
    if (usersActive.length === 0) {
      return null;
    }

    // Sort teams by Name
    let usersById = usersActive.sort(sortByName);
    usersById = usersById === 0 && usersById[0] === undefined ? [] : primaryAtTop(usersById);

    // Array to save users, 0 element is for add user button
    const userArray = usersById.map((user, index) => ({
      key: index + 1,
      user,
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
              {String.t('OrganizationManageMembers.seatAvailables', { count: 100 })}
            </span>
          </div>
        ),
        preferences: {
          logo: 'fa fa-plus'
        },
        editUrl: `/app/inviteNewMember/${subscriberOrgId}`
      },
      status: {
        enabled: false
      }
    });

    return userArray;
  }

  render() {
    // General Consts
    const { users, match } = this.props;
    if (match && match.params && match.params.subscriberOrgId && users) {
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
          title: 'OrganizationManage.editOrganization',
          url: `/app/editOrganization/${subscriberOrgId}`
        },
        {
          icon: 'fas fa-cog',
          title: 'OrganizationManage.manageTeams',
          url: `/app/editOrganization/${subscriberOrgId}/teams`
        }
      ];

      // Table Columns
      const columns = [
        {
          title: 'NAME',
          dataIndex: 'user',
          key: 'user',
          render: user => {
            if (!user) return false;
            return <AvatarWithLabel item={user} enabled={user.enabled} />;
          }
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          render: email => {
            if (!email) return false;
            return <span className="habla-table-label">{email}</span>;
          }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 128,
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
          title: 'Edit',
          key: 'editUser',
          dataIndex: 'editUser',
          render: editUserId => {
            if (!editUserId) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => this.props.history.push(`/app/editUser/${editUserId}`)}>
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
        },
        {
          title: (
            <div className="tableTitle divAsAButton" onClick={() => this.handleToggleAllOrgItem()}>
              {this.state.selectedAll
                ? String.t('OrganizationManage.tableDeselectAll')
                : String.t('OrganizationManage.tableSelectAll')}
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
        <div className="editOrgPage-main">
          <PageHeader
            pageBreadCrumb={pageBreadCrumb}
            hasMenu
            menuName="settings"
            menuPageHeader={menuPageHeader}
            badgeOptions={{
              enabled: true,
              count: this.state.usersActive.length,
              style: { backgroundColor: '#52c41a' }
            }}
          />
          <SimpleCardContainer className="subpage-block habla-color-lighertblue padding-class-a">
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
                    <Option value="activate">Activate</Option>
                    <Option value="deactivate">Deactivate</Option>
                  </Select>

                  <Button type="primary" size="small" className="action__form_button" htmlType="submit">
                    Apply
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
