import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, notification } from 'antd';

import String from 'src/translations';
import { extractQueryParams } from 'src/routes';
import { IntegrationsList } from 'src/containers';
import { PageHeader, Spinner } from 'src/components';
import { badIntegration, successfulIntegration } from './notifications';

const propTypes = {
  orgId: PropTypes.string.isRequired,
  orgName: PropTypes.string.isRequired,
  integrations: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  fetchIntegrations: PropTypes.func.isRequired
};

class IntegrationsPage extends Component {
  componentDidMount() {
    const { orgId, history, fetchIntegrations } = this.props;
    if (!orgId) {
      history.replace('/app');
      return;
    }
    fetchIntegrations();

    const notifyInfo = this.notifyInfo();
    let args = {};
    if (notifyInfo) {
      if (notifyInfo.status !== 'CREATED') {
        args = badIntegration(notifyInfo);
        args.icon = <Icon type="close" className="icon_fail habla-red" />;
      } else {
        args = successfulIntegration(notifyInfo.integration);
        args.icon = <Icon type="check" className="icon_success habla-green" />;
      }
      notification.open(args);
    }
  }

  notifyInfo() {
    const queryParams = extractQueryParams(this.props);
    const { integration, status } = queryParams;
    return integration && status ? queryParams : undefined;
  }

  render() {
    const { integrations, orgId, orgName } = this.props;
    if (!orgId && !integrations) return <Spinner />;

    return (
      <div>
        <PageHeader
          backButton
          pageBreadCrumb={{
            routes: [
              {
                title: orgName,
                link: `/app/organization/${orgId}`
              },
              { title: String.t('integrationsPage.breadcrumb') }
            ]
          }}
        />
        <IntegrationsList integrations={integrations} />
      </div>
    );
  }
}

IntegrationsPage.propTypes = propTypes;

export default IntegrationsPage;
