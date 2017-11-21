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
      messageStrKey: 'msgInvitationToTeamRoom'
    };
  } else if (type.teamName) {
    return {
      type: 'team',
      name: type.teamName,
      id: type.teamId,
      messageStrKey: 'msgInvitationToTeam'
    };
  }
  return {
    type: 'subscriberOrg',
    name: type.subscriberOrgName,
    id: type.subscriberOrgId,
    messageStrKey: 'msgInvitationToOrg'
  };
}

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = { accepted: null };
  }

  componentDidMount() {

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
            message: `You have joined ${name}`,
            duration: 5
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
            {String.t(typeObj.messageStrKey, this.props.options)}
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
