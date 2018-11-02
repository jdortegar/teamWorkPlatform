import React, { Component } from 'react';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { PageHeader, SimpleCardContainer, Spinner, AvatarWithLabel } from 'src/components';
import { integrationLabelFromKey, integrationImageFromKey } from 'src/utils/dataIntegrations';
import { Table, Tooltip, Input, Icon } from 'antd';
import classNames from 'classnames';
import './styles/style.css';

const propTypes = {
  orgId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  integrations: PropTypes.PropTypes.shape({
    byOrg: PropTypes.object
  }).isRequired,
  fetchIntegrations: PropTypes.func.isRequired
};

class OrganizationDataIntegrations extends Component {
  constructor(props) {
    super(props);

    this.state = { integrationsLoaded: false, usersActive: [] };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    const { orgId, history } = this.props;
    if (!orgId) {
      history.replace('/app');
      return;
    }

    this.props.fetchIntegrations().then(() => this.setState({ integrationsLoaded: true }));
  }

  // Handle for search input
  handleSearch(e) {
    const { value } = e.target;
    if (value === '') {
      this.setState({ usersActive: this.usersActive });
    } else {
      const filteredUsers = this.state.usersActive.filter(el =>
        el.name.toLowerCase().includes(value.toLowerCase().trim())
      );
      this.setState({ usersActive: filteredUsers });
    }
  }

  // Handle functions for edit
  handleEditIntegration(action, integrationId) {
    if (action === 'editIntegration') {
      this.props.history.push(`/app/integrations/${integrationId.userId}/${integrationId.integration}`);
      return true;
    }
    return true;
  }

  // Get Users array
  renderIntegrations(integrationsActive) {
    const { orgId } = this.props;
    // If no users, no render
    if (integrationsActive.length === 0) {
      return null;
    }

    const integrationsData = Object.entries(integrationsActive).map(([key, value]) => ({ ...value, key }));

    // Array to save users, 0 element is for add user button
    const integrationArray = integrationsData.map((integrationEl, index) => ({
      key: index + 1,
      integration: {
        ...integrationEl,
        name: integrationLabelFromKey(integrationEl.key),
        preferences: {
          img: integrationImageFromKey(integrationEl.key),
          className: classNames({ desaturate: integrationEl.expired }),
          iconColor: '#FFFFFF'
        },
        editUrl: `/app/integrations/${orgId}/${integrationEl.key}`
      },
      owner: integrationEl.ownerId || 'no owner',
      team: integrationEl.team || 'no team',
      editIntegration: {
        integration: integrationEl.key,
        userId: integrationEl.userId
      }
    }));

    // Add team button
    integrationArray.unshift({
      key: 0,
      integration: {
        name: String.t('OrganizationDataIntegrations.addNew'),
        preferences: {
          logo: 'fa fa-plus'
        },
        editUrl: `/app/integrations/${orgId}`
      },
      status: {
        enabled: false
      }
    });

    return integrationArray;
  }

  render() {
    // General Consts
    const { orgId, integrations } = this.props;
    if (orgId && integrations && this.state.integrationsLoaded) {
      // Breadcrumb
      const pageBreadCrumb = {
        routes: [
          {
            title: String.t('OrganizationPage.title')
          },
          {
            title: String.t('OrganizationDataIntegrations.title', { count: Object.keys(integrations).length })
          }
        ]
      };

      // Table Columns
      const columns = [
        {
          title: 'DATA SOURCE',
          dataIndex: 'integration',
          key: 'integration',
          render: integration => {
            if (!integration) return false;
            return (
              <div className="integration-avatar">
                <AvatarWithLabel item={integration} enabled={integration.enabled} />
              </div>
            );
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
          title: 'Team',
          dataIndex: 'team',
          key: 'team',
          render: team => {
            if (!team) return false;
            return <span className="habla-table-label">{team}</span>;
          }
        },
        {
          title: 'Edit',
          key: 'editIntegration',
          dataIndex: 'editIntegration',
          render: editIntegrationId => {
            if (!editIntegrationId) return false;
            return (
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => this.handleEditIntegration('deleteIntegration', editIntegrationId)}>
                      <i className="fas fa-times fa-lg" />
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
        }
      ];

      return (
        <div className="editOrgPage-main">
          <PageHeader pageBreadCrumb={pageBreadCrumb} hasMenu={false} backButton={`/app/organization/${orgId}`} />
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
              <Table columns={columns} dataSource={this.renderIntegrations(integrations)} pagination={false} />
            </div>
          </SimpleCardContainer>
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationDataIntegrations.propTypes = propTypes;

export default OrganizationDataIntegrations;
