import React, { Component } from 'react';
import { Collapse, Row, Col, Button, Tag, Select, Form, message } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { PageHeader, SimpleCardContainer, AvatarWithLabel, Spinner } from 'src/components';
import { TreeOrganization, SubscriptionModal } from 'src/containers';
import './styles/style.css';

const propTypes = {
  currentSubscriberOrgId: PropTypes.string.isRequired,
  orgData: PropTypes.object.isRequired,
  fetchDataSubscriberOrgs: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.array,
  users: PropTypes.object.isRequired,
  updateTeam: PropTypes.func.isRequired,
  updateTeamMember: PropTypes.func.isRequired
};

const defaultProps = {
  subscriberOrgs: []
};

const { Panel } = Collapse;
const { Option } = Select;

// Breadcrumb
const pageBreadCrumb = {
  routes: [
    {
      title: String.t('OrganizationManage.title')
    }
  ]
};

class OrganizationManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgDataLoaded: false,
      selectedTeams: [],
      selectedTeamMembers: [],
      selectedMemberIntegrations: [],
      selectValue: 'activate',
      modalVisible: false
    };

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props
      .fetchDataSubscriberOrgs(this.props.currentSubscriberOrgId)
      .then(() => this.setState({ orgDataLoaded: true }));
  }

  toggleItemInArray = (collection, item) => {
    if (collection.some(el => el.id === item.id)) {
      return collection.filter(el => el.id !== item.id);
    }
    return [...collection, item];
  };

  handleToggleOrgItem = item => {
    const { selectedTeams, selectedTeamMembers } = this.state;

    if (item.type === 'team') {
      this.setState({ selectedTeams: this.toggleItemInArray(selectedTeams, item.team) });
    } else if (item.type === 'teamMember') {
      this.setState({ selectedTeamMembers: this.toggleItemInArray(selectedTeamMembers, item.teamMember) });
    } else if (item.type === 'memberIntegration') {
      // this.setState({ selectedMemberIntegrations: _.xor(selectedMemberIntegrations, [item.memberIntegration]) });
    }
  };

  showModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    });
  };

  handleToggleAllOrgItem = () => {
    const { orgData } = this.props;
    const teamMembers = [];

    orgData.teams.map(team =>
      team.teamMembers.map(teamMember => {
        const member = {
          id: team.teamId,
          userId: teamMember.userId,
          teamId: team.teamId,
          orgId: this.props.currentSubscriberOrgId
        };

        return teamMembers.push(member);
      })
    );

    this.setState({
      selectedTeams: orgData.teams.map(team => ({
        id: team.teamId,
        teamId: team.teamId,
        orgId: this.props.currentSubscriberOrgId
      })),
      selectedTeamMembers: teamMembers
    });
  };

  handleFormChange(value) {
    this.setState({ selectValue: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { selectValue, selectedTeams, selectedTeamMembers } = this.state;
    const valuesToSend = { active: selectValue === 'activate' };
    if (selectedTeams.length > 0) {
      // Update all teams
      Promise.all(selectedTeams.map(team => this.props.updateTeam(team.orgId, team.teamId, valuesToSend)))
        .then(() => {
          message.success(String.t('OrganizationManage.teamsUpdated'));
          this.setState({ selectedTeams: [] });
        })
        .catch(error => {
          message.error(error.message);
        });
    }
    if (selectedTeamMembers.length > 0) {
      // Update all teamMembers
      Promise.all(
        selectedTeamMembers.map(teamMemberEl =>
          this.props.updateTeamMember(teamMemberEl.orgId, teamMemberEl.teamId, teamMemberEl.userId, valuesToSend)
        )
      )
        .then(() => {
          message.success(String.t('OrganizationManage.teamMembersUpdated'));
          this.setState({ selectedTeamMembers: [] });
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  }

  render() {
    if (this.state.orgDataLoaded) {
      const { subscriberOrgs, currentSubscriberOrgId, orgData, users } = this.props;
      const currentOrg = subscriberOrgs.find(({ subscriberOrgId }) => subscriberOrgId === currentSubscriberOrgId);
      const { subscriberOrgId } = currentOrg;

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
        },
        {
          icon: 'fas fa-cog',
          title: 'OrganizationManage.manageTeams',
          url: `/app/editOrganization/${subscriberOrgId}/teams`
        }
      ];

      return (
        <div className="manageOrganizationPage">
          <PageHeader
            pageBreadCrumb={pageBreadCrumb}
            hasMenu
            backButton
            menuName="manageOrg"
            menuPageHeader={menuPageHeader}
            optionalButtons={{
              enabled: true,
              content: (
                <Tag className="habla_subscription_tag habla_subscription_tag_bronze" onClick={this.showModal}>
                  {String.t('subscriptionPlans.bronze')}
                </Tag>
              )
            }}
          />
          <SimpleCardContainer className="subpage-block subpage-block-actions padding-class-a">
            <div className="header-search-container">
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
          <SimpleCardContainer>
            <div className="tableHeader">
              <Row>
                <Col span={18}>
                  <div className="tableTitle">{String.t('OrganizationManage.tableOrganization')}</div>
                </Col>
                <Col span={2}>
                  <div className="tableTitle">{String.t('OrganizationManage.tableStatus')}</div>
                </Col>
                <Col span={2}>
                  <div className="tableTitle">{String.t('OrganizationManage.tableEdit')}</div>
                </Col>
                <Col span={2}>
                  <div className="tableTitle" onClick={() => this.handleToggleAllOrgItem()}>
                    {String.t('OrganizationManage.tableSelectAll')}
                  </div>
                </Col>
              </Row>
            </div>
          </SimpleCardContainer>
          <SimpleCardContainer className="my-1">
            <Collapse defaultActiveKey={['1']}>
              <Panel
                showArrow={false}
                header={<AvatarWithLabel item={currentOrg} enabled={currentOrg.enabled} />}
                key="1"
              >
                <span className="habla-label habla-bold-text">{String.t('OrganizationManage.projectTeams')}</span>
                <TreeOrganization
                  onToggleSelect={this.handleToggleOrgItem}
                  selectedTeams={this.state.selectedTeams}
                  selectedTeamMembers={this.state.selectedTeamMembers}
                  selectedMemberIntegrations={this.state.selectedMemberIntegrations}
                  orgData={orgData}
                  users={users}
                />
              </Panel>
            </Collapse>
          </SimpleCardContainer>
          <SubscriptionModal visible={this.state.modalVisible} showModal={this.showModal} />
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationManage.propTypes = propTypes;
OrganizationManage.defaultProps = defaultProps;

export default OrganizationManage;
