import React, { Component } from 'react';
import { Row, Col, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';
import String from '../../translations';

const propTypes = {
  options: PropTypes.shape({
    byUserFirstName: PropTypes.string.isRequired,
    byUserLastName: PropTypes.string.isRequired,
    byUserId: PropTypes.string.isRequired,
    subscriberOrgName: PropTypes.string.isRequired,
    subscriberOrgId: PropTypes.string.isRequired,
    teamName: PropTypes.string,
    teamId: PropTypes.string,
    teamRoomName: PropTypes.string,
    teamRoomId: PropTypes.string
  }).isRequired,
  updateInvitation: PropTypes.func.isRequired,
  invitationResponse: PropTypes.func.isRequired
};

function checkType(type) {
  if (type.teamRoomName) {
    return {
      type: 'teamRoom',
      name: type.teamRoomName,
      id: type.teamRoomId,
      message: String.t('msgInvitationToTeamRoom', type)
    };
  } else if (type.teamName) {
    return {
      type: 'team',
      name: type.teamName,
      id: type.teamId,
      message: String.t('msgInvitationToTeam', type)
    };
  }
  return {
    type: 'subscriberOrg',
    name: type.subscriberOrgName,
    id: type.subscriberOrgId,
    message: String.t('msgInvitationToOrg', type)
  };
}

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = { accepted: null };
  }

  handleClick(selection) {
    this.setState({ accepted: selection });
    const typeObj = checkType(this.props.options);
    const { name } = typeObj;
    this.props.invitationResponse({ accept: selection }, typeObj)
      .then(() => {
        this.props.updateInvitation(this.props.options);
        if (selection) {
          const args = {
            message: String.t('invitationAcceptedToast', { name }),
            duration: 4
          };
          notification.open(args);
        }
      })
      .catch(() => {
        this.setState({ accepted: null });
        this.props.updateInvitation(this.props.options);
      });
  }

  render() {
    const typeObj = checkType(this.props.options);
    return (
      <Row type="flex" className="Notification__container">
        <Col
          xs={{ span: 24 }}
          sm={{ span: 15 }}
          md={{ span: 17 }}
          className="Notification__col Notification__col--vertical-center"
        >
          <h3 className="Notification__title">
            {typeObj.message}
          </h3>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 8 }}
          md={{ span: 6 }}
          className="Notification__col Notification__col--vertical-center Notification__col--horizontal-right"
        >
          <Button
            className="Notification__button Notification__button--gray"
            loading={this.state.accepted === true}
            disabled={this.state.accepted === false}
            onClick={() => this.handleClick(true)}
          >
            {String.t('buttonAcceptInvitation')}
          </Button>
          <Button
            className="Notification__button Notification__button--gray"
            loading={this.state.accepted === false}
            disabled={this.state.accepted === true}
            onClick={() => this.handleClick(false)}
          >
            {String.t('buttonDeclineInvitation')}
          </Button>
        </Col>
      </Row>
    );
  }
}

Notification.propTypes = propTypes;

export default Notification;
