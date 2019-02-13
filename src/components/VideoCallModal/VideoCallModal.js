import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from 'antd';
import String from 'src/translations';
import { AvatarWrapper } from 'src/components';
import { soundVideoCall } from 'src/sounds';
import './styles/style.css';

const propTypes = {
  visible: PropTypes.bool,
  showModal: PropTypes.func,
  user: PropTypes.object,
  answerCall: PropTypes.func.isRequired,
  answerTeamCall: PropTypes.func.isRequired,
  videoCallReceived: PropTypes.bool,
  finishCall: PropTypes.func.isRequired,
  teams: PropTypes.array,
  callingData: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired
};

const defaultProps = {
  visible: false,
  showModal: null,
  user: {},
  videoCallReceived: false,
  teams: []
};

const audio = new Audio(soundVideoCall);
audio.loop = true;

class VideoCallModal extends Component {
  state = { callState: String.t('videoCallModal.waitingStatus') };

  componentWillReceiveProps(nextProps) {
    const { callingData, visible } = nextProps;
    const { users } = this.props;
    let callState;

    if (visible) {
      audio.play();
    }

    if (callingData.teamId && callingData.status === 'cancelled') {
      // Stop call sound
      audio.pause();
      audio.currentTime = 0;
      const cancelledBy = users ? users.find(user => user.userId === callingData.receiverId) : null;
      if (cancelledBy) {
        callState = String.t('videoCallModal.cancelledBy', { user: cancelledBy.fullName });
      }
    } else {
      switch (callingData.status) {
        case 'ready':
          callState = String.t('videoCallModal.waitingStatus');
          break;
        case 'accepted':
          callState = String.t('videoCallModal.acceptedStatus');
          break;
        case 'cancelled':
          callState = String.t('videoCallModal.cancelledStatus');
          break;
        default:
          callState = '';
          break;
      }
    }

    this.setState({
      callState
    });

    if (callingData.status === 'accepted' && visible) {
      audio.pause();
      audio.currentTime = 0;
      setTimeout(() => {
        this.props.finishCall();
        this.props.showModal(true);
      }, 5000);
    } else if (callingData.status === 'cancelled' && visible) {
      audio.pause();
      audio.currentTime = 0;
      setTimeout(() => {
        this.props.finishCall();
        this.props.showModal(true);
      }, 2000);
    }
  }

  handleClose = () => {
    this.props.finishCall();
    this.props.showModal(true);
  };

  handleCancel = () => {
    const { callerId, teamId } = this.props.callingData;
    const { currentUser, user } = this.props;
    // Stop call sound
    audio.pause();
    audio.currentTime = 0;
    if (teamId) {
      this.props.answerTeamCall(currentUser.userId, teamId, 'cancelled');
    } else {
      const cancelId = !callerId ? user.userId : callerId;
      this.props.answerCall(cancelId, 'cancelled');
    }
    this.props.finishCall();
    this.props.showModal(true);
  };

  handleAnswer = () => {
    const { callerId, teamId } = this.props.callingData;
    // Stop call sound
    audio.pause();
    audio.currentTime = 0;
    let userUrl;
    if (callerId && teamId) {
      userUrl = teamId.substring(0, callerId.indexOf('-'));
    } else {
      userUrl = callerId.substring(0, callerId.indexOf('-'));
    }
    this.props.answerCall(callerId, 'accepted');
    window.open(
      `https://meet.habla.ai/${userUrl}`,
      'Habla Video Call',
      'toolbar=no, menubar=no, resizable=yes, location=no, titlebar=no, directories=no,'
    );

    this.setState({
      callState: String.t('videoCallModal.acceptedStatus')
    });

    setTimeout(() => {
      this.props.finishCall();
      this.props.showModal(true);
    }, 5000);
  };

  render() {
    const { visible, user, videoCallReceived, callingData, teams, currentUser } = this.props;
    const { teamId, callerId } = callingData;
    const { callState } = this.state;

    let teamSelected;
    if (teamId) {
      teamSelected = teams.find(team => team.teamId === callingData.teamId);
    }

    if (visible) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return (
      <div>
        {visible && (
          <Modal visible={visible} footer={null} closable={false} width={320}>
            <div className="VideoCall_Modal_container">
              <div className="Modal_header">
                <h5 className="Modal_title">
                  <span className="habla-bold-text">
                    {!teamId &&
                      (callerId && callerId !== currentUser.userId
                        ? String.t('videoCallModal.called', { user: user.firstName })
                        : String.t('videoCallModal.calling', { user: user.firstName }))}
                    {teamId && String.t('videoCallModal.teamCall', { team: teamSelected.name })}
                  </span>
                </h5>
              </div>
              <div className="Modal_body">
                <span className="VideoCall_avatar_container">
                  <AvatarWrapper size="large" user={user} />
                  <span className="VideoCall_icon">
                    <i className="fas fa-video fa-2x" />
                  </span>
                </span>
                {(!videoCallReceived || currentUser.userId === callerId) && (
                  <div className="VideoCall_status">{callState}</div>
                )}
              </div>
              <div className="Modal_footer">
                <div className="Action_buttons">
                  {(!videoCallReceived || callState === 'Accepted') && (
                    <Button className="Cancel_button" onClick={() => this.handleCancel()}>
                      {String.t('videoCallModal.close')}
                    </Button>
                  )}
                  {videoCallReceived && !(callState === 'Accepted') && (
                    <Button className="Cancel_button" onClick={() => this.handleCancel()}>
                      {String.t('videoCallModal.cancel')}
                    </Button>
                  )}
                  {videoCallReceived && !(callState === 'Accepted') && currentUser.userId !== callerId && (
                    <Button className="Confirm_button" onClick={() => this.handleAnswer()}>
                      {String.t('videoCallModal.answer')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}

VideoCallModal.propTypes = propTypes;
VideoCallModal.defaultProps = defaultProps;

export default VideoCallModal;
