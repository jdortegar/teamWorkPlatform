import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, invert, xor, compact, sortBy } from 'lodash';

import { Button, message as msg } from 'antd';
import String from 'src/translations';
import { PageHeader, Spinner } from 'src/components';
import { ScheduleMessageModal } from 'src/containers';
import moment from 'moment';
import { hablaLogoAvatar } from 'src/img';
import './styles/style.css';

const propTypes = {
  history: PropTypes.object.isRequired,
  org: PropTypes.object.isRequired,
  scheduleMessages: PropTypes.object,
  subscribers: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  conversationIdsByTeam: PropTypes.object,
  conversationIdsByMember: PropTypes.object,
  fetchScheduleMessages: PropTypes.func.isRequired,
  conversationIds: PropTypes.array.isRequired
};

const defaultProps = {
  scheduleMessages: null,
  conversationIdsByTeam: {},
  conversationIdsByMember: {}
};

class NotificationsPage extends Component {
  state = {
    scheduleModalVisible: false,
    recipient: null,
    message: null,
    action: null,
    globalScheduleId: null,
    loading: false
  };

  async componentWillMount() {
    const { conversationIds } = this.props;
    try {
      await Promise.all(conversationIds.map(this.props.fetchScheduleMessages));
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      msg.error(error.message);
    }
  }

  getRecipient = conversationId => {
    const { conversationIdsByTeam, conversationIdsByMember, teams, subscribers } = this.props;
    const teamId = invert(conversationIdsByTeam)[conversationId];
    if (teamId) {
      const team = teams.find(teamEl => teamEl.teamId === teamId);
      return team.name;
    }

    const userId = invert(conversationIdsByMember)[conversationId];
    const user = subscribers.find(userEl => userEl.userId === userId);

    return user.fullName;
  };

  handleScheduleCancel = message => {
    const { org } = this.props;
    const recipient = message.appData.globalScheduleId ? org.name : this.getRecipient(message.conversationId);
    this.setState({
      scheduleModalVisible: true,
      recipient,
      message,
      action: 'cancel'
    });
  };

  handleScheduleEdit = message => {
    const { org } = this.props;
    const recipient = message.appData.globalScheduleId ? org.name : this.getRecipient(message.conversationId);
    this.setState({
      scheduleModalVisible: true,
      recipient,
      message,
      action: 'edit'
    });
  };

  showScheduleMessageModal = hide => {
    if (!hide) return this.setState({ scheduleModalVisible: false });
    return this.setState({ scheduleModalVisible: !this.state.scheduleModalVisible });
  };

  renderSchedulesMessages = scheduleMessages => {
    let globalScheduleIds = [];
    const { org } = this.props;
    const scheduleMessagesOrdered = sortBy(Object.values(scheduleMessages), el => el.schedule);
    return scheduleMessagesOrdered.map(message => {
      const globalSchedule = globalScheduleIds.some(id => id === message.appData.globalScheduleId);
      if (globalSchedule) return;

      globalScheduleIds = compact(xor(globalScheduleIds, [message.appData.globalScheduleId]));

      // eslint-disable-next-line consistent-return
      return (
        <div className="notification-body" key={message.id}>
          <div className="homePage__activity-container margin-top-class-b">
            <div className="homePage__activity-item">
              <div className="homePage__activity-avatar">
                <img src={hablaLogoAvatar} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
              </div>
              <div className="Notification__activity-content-container">
                <div className="homePage__activity-content-header">
                  {String.t('notificationPage.scheduleBotMessage', {
                    recipient: message.appData.globalScheduleId ? org.name : this.getRecipient(message.conversationId),
                    date: moment(message.schedule).format('DD MMM YYYY HH:mm')
                  })}
                </div>
                <div className="Notification__Message-Container">
                  <div className="Notification__activity-content-message">{message.content[0].text}</div>
                  <div className="Notification__Action-Buttons-Container">
                    <Button
                      type="alert"
                      className="habla-button--type-main margin-right-class-a"
                      onClick={() => this.handleScheduleEdit(message)}
                    >
                      {String.t('editButton')}
                    </Button>
                    <Button
                      type="main"
                      className="habla-button--type-alert"
                      onClick={() => this.handleScheduleCancel(message)}
                    >
                      {String.t('cancelButton')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { history, org, scheduleMessages } = this.props;
    const { scheduleModalVisible, loading } = this.state;

    if (loading) return <Spinner />;

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('notificationPage.title')
        }
      ]
    };

    return (
      <div>
        <PageHeader backButton settingsIcon pageBreadCrumb={pageBreadCrumb} />
        <div className="notification-body">
          <div className="homePage__activity-container margin-top-class-b">
            <div className="homePage__activity-item">
              <div className="homePage__activity-avatar">
                <img src={hablaLogoAvatar} alt={String.t('Header.logoAlt')} className="homePage__activity-avatar" />
              </div>
              <div className="homePage__activity-content-container">
                <div className="homePage__activity-content-header">Habla AI Bot</div>
                <div className="homePage__activity-content-message">
                  Welcome to Habla AI. To start using our tool as is best, please{' '}
                  <a onClick={() => history.push(`/app/integrations/${org.subscriberOrgId}`)}> add a data connector </a>
                  to see your files on the time activity view on the CKG.{' '}
                  <a onClick={() => history.push(`/app/organization/${org.subscriberOrgId}`)}>Invite people</a> to your
                  teams and start new conversations. We hope that now you spend minutes finding the right data instead
                  of searching folders for hours. The Habla Ai Team.
                  <span className="homePage__activity-content-date"> ({moment(org.created).fromNow()})</span>
                </div>
              </div>
            </div>
          </div>

          {!isEmpty(scheduleMessages) && this.renderSchedulesMessages(scheduleMessages)}
        </div>
        {scheduleModalVisible && (
          <ScheduleMessageModal
            subtitle={this.state.recipient}
            message={this.state.message}
            okButton={String.t('confirmButton')}
            visible={this.state.scheduleModalVisible}
            showScheduleMessageModal={this.showScheduleMessageModal}
            globalScheduleId={this.state.globalScheduleId}
            action={this.state.action}
          />
        )}
      </div>
    );
  }
}

NotificationsPage.propTypes = propTypes;
NotificationsPage.defaultProps = defaultProps;

export default NotificationsPage;
