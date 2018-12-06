import React from 'react';
import { Layout } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Header, Sidebar, MainContent, SurveyModal, SubscriptionModal } from 'src/containers';
import { HablaModal, Spinner } from 'src/components';
import './styles/main.css';
import String from 'src/translations';

const propTypes = {
  initMessaging: PropTypes.func.isRequired,
  closeMessaging: PropTypes.func.isRequired,
  fetchGlobalState: PropTypes.func.isRequired,
  fetchInvitations: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.object.isRequired,
  subscriberOrg: PropTypes.object.isRequired,
  subscription: PropTypes.object,
  fetchSubscription: PropTypes.func.isRequired,
  fetchSubscriberOrgs: PropTypes.func.isRequired
};

const defaultProps = {
  subscription: {}
};

class Main extends React.Component {
  state = {
    modalVisible: false,
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
    window.addEventListener('beforeunload', this.onUnload);
    // Modals if subscription is on trial
    this.props.fetchSubscriberOrgs().then(() => {
      setTimeout(this.setState({ orgLoaded: true }), 5000);
      const { stripeSubscriptionId } = this.props.subscriberOrg || {};
      const { subscription } = this.props;
      if (subscription) {
        this.props.fetchSubscription(stripeSubscriptionId).then(() => {
          if (subscription.status === 'trialing' && moment(subscription.trial_end * 1000).diff(moment(), 'days') <= 0) {
            this.setState({
              hablaModalVisible: true,
              hablaModalTitle: String.t('organizationSummaryPage.trialOverTitle'),
              hablaModalBody: <div>{String.t('organizationSummaryPage.trialOverBody')}</div>,
              hablaModalButton: String.t('organizationSummaryPage.trialOverButton'),
              cancelButton: false
            });
          }
          if (
            subscription.status === 'trialing' &&
            moment(subscription.trial_end * 1000).diff(moment(), 'days') === 3
          ) {
            this.setState({
              hablaModalVisible: true,
              hablaModalTitle: String.t('organizationSummaryPage.3daysTitle'),
              hablaModalBody: (
                <div>
                  {String.t('organizationSummaryPage.3daysBody1')} <br />
                  <br /> {String.t('organizationSummaryPage.3daysBody2')}{' '}
                  <a href="mailto:support@habla.ai">support@habla.ai</a>
                </div>
              ),
              hablaModalButton: String.t('organizationSummaryPage.trialOverButton'),
              cancelButton: true
            });
          }
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.subscriberOrgs.currentSubscriberOrgId !== nextProps.subscriberOrgs.currentSubscriberOrgId) {
      this.props.fetchGlobalState();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onUnload);
  }

  onUnload = () => {
    this.props.closeMessaging();
  };

  showModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      hablaModalVisible: !this.state.cancelButton
    });
  };

  showHablaModal = () => {
    this.setState({
      hablaModalVisible: !this.state.hablaModalVisible
    });
  };

  render() {
    if (!this.state.orgLoaded) {
      return <Spinner />;
    }

    return (
      <Layout>
        <Header />
        <Layout className="ant-layout-has-sider">
          <Sidebar />
          <Layout className="habla-main-content">
            <MainContent />
          </Layout>
          <SurveyModal />
          <SubscriptionModal
            visible={this.state.modalVisible}
            showModal={this.showModal}
            cancelButton={this.state.cancelButton}
          />
          <HablaModal
            visible={this.state.hablaModalVisible}
            cancelButton={false}
            showHablaModal={this.showHablaModal}
            showModal={this.showModal}
            titleText={this.state.hablaModalTitle}
            bodyText={this.state.hablaModalBody}
            buttonText={this.state.hablaModalButton}
          />
        </Layout>
      </Layout>
    );
  }
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;

export default Main;
