import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  user: PropTypes.object.isRequired,
  teamId: PropTypes.string,
  makeTeamCall: PropTypes.func.isRequired
};

const defaultProps = {
  teamId: null
};

class TeamCallButton extends Component {
  handleVideoCall = () => {
    const { user, teamId } = this.props;
    this.props.makeTeamCall(user.userId, teamId);
  };

  render() {
    return (
      <div>
        {this.props.teamId && (
          <Tooltip placement="topRight" title={String.t('ckgPage.VideoCallTooltip')}>
            <span className="Chat_videoCall" onClick={this.handleVideoCall}>
              <i className="fa fa-phone" />
            </span>
          </Tooltip>
        )}
      </div>
    );
  }
}

TeamCallButton.defaultProps = defaultProps;
TeamCallButton.propTypes = propTypes;

export default TeamCallButton;
