import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import { VideoCallModal } from 'src/containers';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  caller: PropTypes.string.isRequired,
  called: PropTypes.object.isRequired,
  makePersonalCall: PropTypes.func.isRequired
};

class PersonalCallButton extends Component {
  state = {
    videoCallModalVisible: false,
    videoCallUser: {},
    videoCallReceived: null
  };

  handleVideoCall = () => {
    const { caller, called } = this.props;
    this.setState({
      videoCallUser: called,
      videoCallModalVisible: true,
      videoCallReceived: false
    });
    this.props.makePersonalCall(caller, called.userId);
  };

  showVideoCallModal = hide => {
    if (hide) {
      return this.setState({
        videoCallModalVisible: false
      });
    }
    return this.setState({
      videoCallModalVisible: !this.state.videoCallModalVisible
    });
  };

  render() {
    return (
      <div className="PersonalCall_Container">
        <Tooltip placement="topRight" title={String.t('directMessagesPage.startVideoCall')}>
          <span className="Chat_personal_videoCall" onClick={this.handleVideoCall}>
            <i className="fa fa-phone" />
          </span>
        </Tooltip>
        <VideoCallModal
          visible={this.state.videoCallModalVisible}
          showModal={this.showVideoCallModal}
          user={this.state.videoCallUser}
          videoCallReceived={this.state.videoCallReceived}
        />
      </div>
    );
  }
}

PersonalCallButton.propTypes = propTypes;

export default PersonalCallButton;
