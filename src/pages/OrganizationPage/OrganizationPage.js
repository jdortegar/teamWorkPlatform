import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

import { Tag, message } from 'antd';
import String from 'src/translations';
import config from 'src/config/env';
import { hablaFullBlackLogoIcon } from 'src/img';
import { PageHeader, SimpleCardContainer, Spinner } from 'src/components';
import { SubscriptionModal } from 'src/containers';
import Avatar from 'src/components/common/Avatar';
import CardView from './CardView';
import './styles/style.css';

const propTypes = {
  integrations: PropTypes.PropTypes.shape({
    byOrg: PropTypes.object
  }).isRequired,
  fetchIntegrations: PropTypes.func.isRequired,
  subscriberOrg: PropTypes.object.isRequired,
  fetchSubscribersBySubscriberOrgId: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  subscribers: PropTypes.array.isRequired,
  subscribersPresences: PropTypes.object.isRequired,
  teams: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired,
  subscription: PropTypes.object,
  fetchSubscription: PropTypes.func.isRequired,
  fetchPaypalSubscription: PropTypes.func.isRequired,
  paypalSubscription: PropTypes.object,
  paypalSubscriptionId: PropTypes.string
};

const defaultProps = {
  subscription: {},
  paypalSubscription: null,
  paypalSubscriptionId: null
};

// Get subscriber avatar or Initials
function renderAvatar(item, enabled, size) {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': !enabled,
    'border-white-1': true
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} size={size} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} size={size} />;
  }
  const nameInitial = item.name.substring(0, 1).toUpperCase();
  return (
    <Avatar color={preferences.iconColor} className={className} size={size}>
      {nameInitial}
    </Avatar>
  );
}

class OrganizationPage extends Component {
  state = {
    integrationsLoaded: false,
    subscribersLoaded: false,
    modalVisible: false,
    subscriptionLoaded: false,
    hablaModalVisible: false
  };

  componentDidMount() {
    const { orgId, history, fetchSubscribersBySubscriberOrgId, fetchIntegrations, paypalSubscriptionId } = this.props;

    if (!orgId) {
      history.replace('/app');
      return;
    }

    if (paypalSubscriptionId) {
      message.success(String.t('subscriptionModal.planUpdated'));
    }

    fetchSubscribersBySubscriberOrgId(orgId).then(() => this.setState({ subscribersLoaded: true }));
    fetchIntegrations().then(() => this.setState({ integrationsLoaded: true }));

    const { stripeSubscriptionId } = this.props.subscriberOrg || {};
    if (stripeSubscriptionId) {
      this.props.fetchSubscription(stripeSubscriptionId).then(() => {
        this.setState({ subscriptionLoaded: true });
      });
    }

    const paypalId = this.props.subscriberOrg.paypalSubscriptionId;

    if (paypalId) {
      this.props
        .fetchPaypalSubscription(paypalId)
        .then(() => {
          this.setState({ subscriptionLoaded: true });
        })
        .catch(error => {
          this.setState({ subscriptionLoaded: true });
          if (error.response && error.response.status === 500) {
            message.error(String.t('editTeamPage.subscriptionError'));
          } else {
            message.error(error.message);
          }
        });
    }
  }

  showModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      hablaModalVisible: false
    });
  };

  handleSubmit = () => {
    this.setState({
      hablaModalVisible: false,
      modalVisible: true
    });
  };

  showHablaModal = () => {
    this.setState({
      hablaModalVisible: !this.state.hablaModalVisible
    });
  };

  redirectPublicSite = () => {
    window.open('https://www.habla.ai/plans.html', '_blank');
  };

  render() {
    const {
      teams,
      integrations,
      subscribers,
      subscribersPresences,
      subscriberOrg,
      user,
      orgId,
      subscription,
      paypalSubscription
    } = this.props;
    if (
      subscribers &&
      subscribersPresences &&
      subscriberOrg &&
      teams &&
      integrations &&
      this.state.subscribersLoaded &&
      this.state.integrationsLoaded &&
      user
    ) {
      const isOrgAdmin = Object.keys(user.subscriberOrgs).length > 0 && user.subscriberOrgs[orgId].role === 'admin';

      // Breadcrumb
      const pageBreadCrumb = {
        routes: [
          {
            title: String.t('OrganizationPage.title')
          }
        ]
      };

      // Page Menu
      const menuPageHeader = [
        {
          icon: 'fas fa-cog',
          title: 'OrganizationPage.addNewTeam',
          url: `/app/createTeam/${orgId}`
        }
      ];

      return (
        <div className="OrgSummary editOrgPage-main">
          <PageHeader pageBreadCrumb={pageBreadCrumb} hasMenu menuName="settings" menuPageHeader={menuPageHeader} />
          <SimpleCardContainer className="subpage-block habla-color-blue align-center-class">
            {renderAvatar(subscriberOrg, subscriberOrg.enabled, 'x-large')}
            <div className="mt-2">
              <h1 className="habla-organization-title">{subscriberOrg.name}</h1>
            </div>
          </SimpleCardContainer>
          <SimpleCardContainer className="align-center-class">
            <div>
              <div className="Flex_row">
                <div className="Summary_label">{String.t('organizationSummaryPage.subscriptionPlan')}</div>
                <div>
                  {subscription.status === 'trialing' && !(Object.values(paypalSubscription).length > 0) && (
                    <span className="Summary_daysLeft">
                      {String.t('organizationSummaryPage.daysLeft', {
                        count: moment(subscription.trial_end * 1000).diff(moment(), 'days')
                      })}
                    </span>
                  )}
                  <Tag
                    className="habla_subscription_tag habla_subscription_tag_bronze"
                    onClick={() =>
                      this.state.subscriptionLoaded && isOrgAdmin ? this.showModal() : this.redirectPublicSite()
                    }
                  >
                    {subscription.status === 'trialing' && !(Object.values(paypalSubscription).length > 0)
                      ? String.t('subscriptionPlans.trial')
                      : String.t('subscriptionPlans.bronze')}
                  </Tag>
                </div>
              </div>
              <div className="Flex_row">
                <div>{String.t('organizationSummaryPage.availableSeat')}</div>
                <div>
                  <span className="habla-bold-text">{subscribers.length}</span> {String.t('organizationSummaryPage.of')}{' '}
                  <span>{subscriberOrg.userLimit}</span>
                </div>
              </div>
              <div className="Flex_row">
                <div>{String.t('organizationSummaryPage.projectTeams')}</div>
                <div className="habla-bold-text">{teams.length}</div>
              </div>
              {/* <div className="Flex_row">
                <div>{String.t('organizationSummaryPage.filesShared')}</div>
                <div className="habla-bold-text">{filesShared}</div>
              </div> */}
            </div>
          </SimpleCardContainer>
          <CardView
            integrations={integrations}
            subscribers={subscribers}
            subscribersPresences={subscribersPresences}
            orgId={orgId}
            teams={teams}
            user={user}
          />
          <div className="app-version-container">
            <div className="app-version">
              <img src={hablaFullBlackLogoIcon} alt="habla.ai" />
              HABLA.AI - {config.hablaApiEnv !== 'prod' ? config.hablaApiEnv.toUpperCase() : 'APP'}{' '}
              {config.hablaWebAppVersion}
            </div>
          </div>
          <SubscriptionModal visible={this.state.modalVisible} showModal={this.showModal} />
        </div>
      );
    }

    return <Spinner />;
  }
}

OrganizationPage.propTypes = propTypes;
OrganizationPage.defaultProps = defaultProps;

export default OrganizationPage;
