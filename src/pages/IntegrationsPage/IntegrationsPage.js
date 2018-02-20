import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, notification, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { extractQueryParams } from '../../routes';
import { badIntegration, successfulIntegration } from './notifications';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import { ImageCard } from '../../components/cards';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { boxLogo, googleDriveLogo, sharepointLogo, office365Logo, salesforceLogo } from '../../img';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  match: PropTypes.object.isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  subscriberOrgs: PropTypes.object.isRequired
};

class IntegrationsPage extends Component {
  componentDidMount() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.fetchIntegrations(subscriberOrgId);

    const notifyInfo = this.notifyInfo();
    let args = {};
    if (notifyInfo) {
      if (notifyInfo.status !== 'CREATED') {
        args = badIntegration(notifyInfo);
        args.icon = (<Icon type="close" className="icon_fail habla-red" />);
      } else {
        args = successfulIntegration(notifyInfo.integration);
        args.icon = (<Icon type="check" className="icon_success habla-green" />);
      }
      // TODO: show notification.
      // ex. notifyInfo = { integration: 'bogus', status: 'CREATED' } will say something like "You have successfully authorized Bogus Drive access."
      // Also statuses FORBIDDEN = "You did not authorize Bogus Drive access."
      // NOT_FOUND, subscriberOrg doesn't exist, which should almost never happen, since they have access or we have a bug in our code.
      // INTERNAL_SERVER_ERROR,  don't know, display something appropriate...
      // Same for box.
      notification.open(args);
    }
  }

  notifyInfo() {
    const queryParams = extractQueryParams(this.props);
    const { integration, status } = queryParams;
    return ((integration) && (status)) ? queryParams : undefined;
  }

  render() {
    const { integrationsBySubscriberOrgId, working, error } = this.props.integrations;

    if (error) {
      return (
        <div>{String.t('integrationsPage.errorMessage')}</div>
      );
    }

    if (working === true) {
      return null;
    }

    const { subscriberOrgId } = this.props.match.params;
    const integrations = integrationsBySubscriberOrgId[subscriberOrgId] || [];

    const renderIntegrations = () => {
      const integrationsArr = [];
      let boxExtra = null;
      let googleExtra = null;

      if (!_.isEmpty(integrations)) {
        const { google, box } = integrations;
        if (box) {
          const { expired, revoked } = box;
          if ((typeof revoked === 'undefined') || (revoked === false)) {
            boxExtra = (<i className="fa fa-check-circle icon_success habla-green" />);
            if (expired === true) {
              boxExtra = (<i className="fa fa-times-circle habla-red" />);
            }
          }
        }

        if (google) {
          const { expired, revoked } = google;
          if ((typeof revoked === 'undefined') || (revoked === false)) {
            googleExtra = (<i className="fa fa-check-circle icon_success habla-green" />);
            if (expired === true) {
              googleExtra = (<i className="fa fa-times-circle icon_fail habla-red" />);
            }
          }
        }
      }
      integrationsArr.push(
        <div key="box">
          <Tooltip placement="top" title="Box">
            <Link to={`/app/integrations/${subscriberOrgId}/box`}>
              <ImageCard imgSrc={boxLogo} extra={boxExtra} />
            </Link>
          </Tooltip>
        </div>
      );
      integrationsArr.push(
        <div key="google">
          <Tooltip placement="top" title="Google">
            <Link to={`/app/integrations/${subscriberOrgId}/google`}>
              <ImageCard imgSrc={googleDriveLogo} extra={googleExtra} />
            </Link>
          </Tooltip>
        </div>
      );

      return integrationsArr;
    };

    const subscriberOrg = this.props.subscriberOrgs.subscriberOrgById[subscriberOrgId];
    return (
      <div>
        <SubpageHeader
          breadcrumb={
            <BreadCrumb
              subscriberOrg={subscriberOrg}
              routes={[
                {
                  title: subscriberOrg.name,
                  link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                },
                { title: String.t('integrationsPage.breadcrumb') }
              ]}
            />
          }
        />
        <div className="padding-class-b">
          <div className="habla-paragraph">{String.t('integrationsPage.selectIntegration')}</div>
          <SimpleCardContainer className="Simple-card--no-padding Simple-card--container--flex habla-integration-list margin-top-class-b">
            <Row type="flex">
              {renderIntegrations()}
              {
              // FOR DEMO PURPOSES ONLY: Temporal Integrations Icons for DEMO.
              }
              <div key="sharepoint">
                <Tooltip placement="top" title="SharePoint">
                  <Link to={`/app/integrations/${subscriberOrgId}`}>
                    <ImageCard imgSrc={sharepointLogo} />
                  </Link>
                </Tooltip>
              </div>

              <div key="office365">
                <Tooltip placement="top" title="Office 365">
                  <Link to={`/app/integrations/${subscriberOrgId}`}>
                    <ImageCard imgSrc={office365Logo} />
                  </Link>
                </Tooltip>
              </div>

              <div key="salesforce">
                <Tooltip placement="top" title="Salesforce">
                  <Link to={`/app/integrations/${subscriberOrgId}`}>
                    <ImageCard imgSrc={salesforceLogo} />
                  </Link>
                </Tooltip>
              </div>

            </Row>
          </SimpleCardContainer>
        </div>
      </div>
    );
  }
}

IntegrationsPage.propTypes = propTypes;

export default IntegrationsPage;
