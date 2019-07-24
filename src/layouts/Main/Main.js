import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Header, Onboarding, Sidebar, MainContent, SurveyModal, SubscriptionModal } from 'src/containers';
import { HablaModal, Spinner } from 'src/components';
import './styles/main.css';
import String from 'src/translations';

const propTypes = {
  closeMessaging: PropTypes.func.isRequired,
  fetchGlobalState: PropTypes.func.isRequired,
  fetchInvitations: PropTypes.func.isRequired,
  fetchRequests: PropTypes.func.isRequired,
  fetchSubscriberOrgs: PropTypes.func.isRequired,
  fetchSubscription: PropTypes.func.isRequired,
  initMessaging: PropTypes.func.isRequired,
  subscriberOrg: PropTypes.object,
  subscriberOrgs: PropTypes.object.isRequired,
  userRoles: PropTypes.object,
  subscription: PropTypes.object
};

const defaultProps = {
  subscriberOrg: {},
  subscription: null,
  userRoles: {}
};

class Main extends React.Component {
  state = {
    subscriptionModalVisible: false,
    hablaModalVisible: false,
    hablaModalTitle: '',
    hablaModalBody: '',
    hablaModalButton: '',
    cancelButton: false,
    orgLoaded: false
  };

  componentDidMount() {
    this.props.fetchGlobalState();
    this.props.initMessaging();
    this.props.fetchInvitations();
    this.props.fetchRequests();
    window.addEventListener('beforeunload', this.onUnload);
    // Modals if subscription is on trial
    this.props.fetchSubscriberOrgs().then(() => {
      setTimeout(this.setState({ orgLoaded: true }), 5000);
      const { stripeSubscriptionId } = this.props.subscriberOrg || {};
      this.props.fetchSubscription(stripeSubscriptionId);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subscriberOrgs.currentSubscriberOrgId !== nextProps.subscriberOrgs.currentSubscriberOrgId) {
      this.props.fetchGlobalState();
    }

    if (this.props.subscription !== nextProps.subscription) {
      const { subscription } = nextProps;
      if (subscription) {
        if (
          (subscription.status === 'trialing' && moment(subscription.trial_end * 1000).diff(moment(), 'days') <= 0) ||
          subscription.status === 'canceled' ||
          subscription.status === 'past_due'
        ) {
          this.setState({
            hablaModalVisible: true,
            hablaModalTitle:
              subscription.status === 'canceled' || subscription.status === 'past_due'
                ? String.t('organizationSummaryPage.subscriptionOverTitle')
                : String.t('organizationSummaryPage.trialOverTitle'),
            hablaModalBody: (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: String.t('organizationSummaryPage.trialOverBody') }} />
            ),
            hablaModalButton: String.t('organizationSummaryPage.trialOverButton'),
            cancelButton: false
          });
        }
        if (subscription.status === 'trialing' && moment(subscription.trial_end * 1000).diff(moment(), 'days') === 3) {
          this.setState({
            hablaModalVisible: true,
            hablaModalTitle: String.t('organizationSummaryPage.3daysTitle'),
            hablaModalBody: (
              // eslint-disable-next-line react/no-danger
              <div dangerouslySetInnerHTML={{ __html: String.t('organizationSummaryPage.3daysBody') }} />
            ),
            hablaModalButton: String.t('organizationSummaryPage.trialOverButton'),
            cancelButton: true
          });
        }
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  onUnload = () => {
    this.props.closeMessaging();
  };

  showSubscriptionModal = option => {
    this.setState({
      subscriptionModalVisible: option,
      hablaModalVisible: option === false ? option : this.state.hablaModalVisible
    });
  };

  showHablaModal = option => {
    this.setState({
      hablaModalVisible: option
    });
  };

  render() {
    if (!this.state.orgLoaded) {
      return <Spinner />;
    }

    const admin = this.props.userRoles.admin || null;

    const {
      subscriptionModalVisible,
      cancelButton,
      hablaModalVisible,
      hablaModalTitle,
      hablaModalBody,
      hablaModalButton
    } = this.state;

    return (
      <Layout>
        <Header />
        <Layout className="ant-layout-has-sider">
          <Sidebar />
          <Layout className="habla-main-content">
            <MainContent />
          </Layout>
          <SurveyModal />
          <Onboarding />
          <SubscriptionModal
            visible={subscriptionModalVisible}
            showSubscriptionModal={this.showSubscriptionModal}
            showHablaModal={this.showHablaModal}
            cancelButton={cancelButton}
          />
          <HablaModal
            visible={hablaModalVisible}
            cancelButton={cancelButton}
            acceptButton={admin}
            showHablaModal={this.showHablaModal}
            acceptFunction={this.showSubscriptionModal}
            titleText={hablaModalTitle}
            bodyText={hablaModalBody}
            buttonText={hablaModalButton}
          />
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;

export default Main;
