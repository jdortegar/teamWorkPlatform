import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'src/components';
import { soundNotificationInvitationAudio } from 'src/sounds';
import { message } from 'antd';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  request: PropTypes.object.isRequired,
  requestResponse: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  userFullName: PropTypes.string.isRequired
};

const notificationAudio = new Audio(soundNotificationInvitationAudio);

class RequestNotification extends Component {
  state = { accepted: null };

  componentDidMount() {
    notificationAudio.play();
  }

  handleClick(selection) {
    this.setState({ accepted: selection });
    const { request } = this.props;
    this.props.requestResponse({ accepted: selection }, request).catch(error => message.error(error.message));
  }

  render() {
    const { team, userFullName } = this.props;
    return (
      <div className="RequestNotification__container">
        <div className="RequestNotification__container__content">
          <span className="RequestNotification__title habla-label">
            {String.t('requestNotification.requestToJoin', { userFullName, teamName: team.name })}
          </span>
          <div className="RequestNotification__buttons">
            <Button
              type="alert"
              fitText
              className="margin-right-class-a"
              loading={this.state.accepted === false}
              disabled={this.state.accepted === true}
              onClick={() => this.handleClick(false)}
            >
              {String.t('buttonDeclineInvitation')}
            </Button>
            <Button
              type="main"
              fitText
              loading={this.state.accepted === true}
              disabled={this.state.accepted === false}
              onClick={() => this.handleClick(true)}
            >
              {String.t('buttonAcceptInvitation')}
            </Button>
          </div>
          <div className="clear" />
        </div>
      </div>
    );
  }
}

RequestNotification.propTypes = propTypes;

export default RequestNotification;
