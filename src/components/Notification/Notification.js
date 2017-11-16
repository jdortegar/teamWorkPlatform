import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';
import './styles/style.css';

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
    return { type: 'teamRoom', name: type.teamRoomName, id: type.teamRoomId };
  } else if (type.teamName) {
    return { type: 'team', name: type.teamName, id: type.teamId };
  }
  return { type: 'subscriberOrg', name: type.subscriberOrgName, id: type.subscriberOrgId };
}

class Notification extends Component {
  constructor(props) {
    super(props);

    this.state = { accepted: null };
  }

  handleClick(selection) {
    this.setState({ accepted: selection });
    const typeObj = checkType(this.props.options);
    const { type, id } = typeObj;
    this.props.invitationResponse({ accept: selection }, typeObj)
      .then(() => {
        this.props.updateInvitation(this.props.options);
        if (type === 'subscriberOrg') {
          window.location.href = `/app/organization/${id}`;
        } else {
          window.location.href = `/app/${type}/${id}`;
        }
      })
      .catch(() => {
        this.setState({ accepted: null });
        this.props.updateInvitation(this.props.options);
      });
  }

  render() {
    const { byUserFirstName, byUserLastName } = this.props.options;
    console.log(this.props.options);
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
            {byUserFirstName} {byUserLastName} invited you to join {typeObj.name}
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
            Accept
          </Button>
          <Button
            className="Notification__button Notification__button--gray"
            loading={this.state.accepted === false}
            disabled={this.state.accepted === true}
            onClick={() => this.handleClick(false)}
          >
            Decline
          </Button>
        </Col>
      </Row>
    );
  }
}

Notification.propTypes = propTypes;

export default Notification;
