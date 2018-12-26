import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from 'antd';
import String from 'src/translations';
import { AvatarWrapper } from 'src/components';
import './styles/style.css';

const propTypes = {
  visible: PropTypes.bool,
  showModal: PropTypes.func,
  user: PropTypes.object,
  answerCall: PropTypes.func,
  videoCallReceived: PropTypes.bool,
  finishCall: PropTypes.func,
  callerId: PropTypes.string,
  teamId: PropTypes.string,
  teams: PropTypes.array
};

const defaultProps = {
  visible: false,
  showModal: null,
  user: {},
  answerCall: null,
  videoCallReceived: false,
  finishCall: null,
  callerId: null,
  teamId: null,
  teams: []
};

class VideoCallModal extends Component {
  state = { hideAnswerButton: false };

  handleCancel = () => {
    this.props.finishCall();
    this.props.showModal();
    this.setState({
      hideAnswerButton: false
    });
  };

  handleAnswer = () => {
    const { callerId } = this.props;
    const userUrl = callerId.substring(0, callerId.indexOf('-'));
    this.setState({
      hideAnswerButton: true
    });

    this.props.answerCall(callerId, true);
    window.open(
      `https://meet.habla.ai/${userUrl}`,
      'Habla Video Call',
      'toolbar=no, menubar=no, resizable=yes, location=no, titlebar=no, directories=no,'
    );
  };

  render() {
    const { visible, user, videoCallReceived, callerId, teamId, teams } = this.props;
    const { hideAnswerButton } = this.state;
    let teamSelected;
    if (teamId) {
      teamSelected = teams.find(team => team.teamId === teamId);
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
                      (callerId
                        ? String.t('videoCallModal.called', { user: user.firstName })
                        : String.t('videoCallModal.calling', { user: user.firstName }))}
                    {teamId && String.t('videoCallModal.teamCall', { team: teamSelected.name })}
                  </span>
                </h5>
              </div>
              <div className="Modal_body">
                <span className="VideoCall_avatar_container">
                  <AvatarWrapper size="large" user={user} />
                </span>
                <span className="VideoCall_icon">
                  <i className="fas fa-video fa-2x" />
                </span>
              </div>
              <div className="Modal_footer">
                <div className="Action_buttons">
                  <Button className="Cancel_button" onClick={this.handleCancel}>
                    {String.t('videoCallModal.cancel')}
                  </Button>
                  {videoCallReceived && !hideAnswerButton && (
                    <Button className="Confirm_button" onClick={() => this.handleAnswer(callerId)}>
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
