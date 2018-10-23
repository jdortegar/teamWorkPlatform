import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import String from 'src/translations';
import { sortByName, primaryAtTop } from 'src/redux-hablaai/selectors/helpers';
import { PageHeader, SimpleCardContainer, Spinner, AvatarWithLabel } from 'src/components';
import { Table, Tooltip, Input, Icon, Switch } from 'antd';
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
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired,
  fetchSubscribersBySubscriberOrgId: PropTypes.func.isRequired
};

class OrganizationManageMembers extends Component {
  constructor(props) {
    super(props);

    this.state = { subscribersLoaded: false, usersActive: [] };

    const usersActive = this.props.subscribers;
    this.usersActive = usersActive;
    this.state = {
      usersActive
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const { match, subscriberOrgs } = this.props;
    if (
      !match ||
      !match.params ||
      !match.params.subscriberOrgId ||
      match.params.subscriberOrgId !== subscriberOrgs.currentSubscriberOrgId
    ) {
      this.props.history.replace('/app');
      return;
    }
    const { subscriberOrgId } = this.props.match.params;

    if (subscriberOrgId !== this.props.subscriberOrgs.currentSubscriberOrgId) {
      this.props.setCurrentSubscriberOrgId(subscriberOrgId);
    }

    this.props
      .fetchSubscribersBySubscriberOrgId(subscriberOrgId)
      .then(() => this.setState({ subscribersLoaded: true }));
  }

  componentWillReceiveProps(nextProps) {
    const nextOrgId = nextProps.match.params.subscriberOrgId;
    if (nextOrgId !== this.props.match.params.subscriberOrgId) {
      this.setState({
        subscribersLoaded: false
      });
      this.props.fetchSubscribersBySubscriberOrgId(nextOrgId).then(() => this.setState({ subscribersLoaded: true }));
    }
  }

  // Switch function to enable / disable user.

  // Handle for search input
  handleSearch(e) {
    const { value } = e.target;
    if (value === '') {
      this.setState({ usersActive: this.usersActive });
    } else {
      const filteredUsers = this.state.usersActive.filter(user =>
        user.firstName.toLowerCase().includes(value.toLowerCase().trim())
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
        enabled: user.enabled,
        userId: user.userId
      },
      editUser: user.userId
    }));

    // Add team button
    userArray.unshift({
      key: 0,
      user: {
        name: String.t('OrganizationManageMembers.addNew'),
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
    const { subscribers, subscribersPresences, subscriberOrgs, match } = this.props;
    if (
      match &&
      match.params &&
      match.params.subscriberOrgId &&
      subscribers &&
      subscribersPresences &&
      subscriberOrgs &&
      subscriberOrgs.subscriberOrgById &&
      subscriberOrgs.subscriberOrgById[match.params.subscriberOrgId] &&
      this.state.subscribersLoaded
    ) {
      const { subscriberOrgId } = match.params;

      const orgSubscribers = subscribers.map(subscriber => ({
        ...subscriber,
        online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
      }));

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
          render: status => {
            if (!status.enabled) return false;
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
                  // onChange={checked => this.handleChangeStatus(checked, status.teamId)}
                  checked={status.enabled}
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
        }
      ];

      return (
        <div className="editOrgPage-main">
          <PageHeader
            pageBreadCrumb={pageBreadCrumb}
            hasMenu
            menuName="settings"
            menuPageHeader={menuPageHeader}
            hasNotification={{
              enabled: true,
              count: orgSubscribers.length,
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
