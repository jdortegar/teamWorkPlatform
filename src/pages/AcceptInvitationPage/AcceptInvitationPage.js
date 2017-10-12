import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import { withRouter } from 'react-router';
import axios from 'axios';
import PropTypes from 'prop-types';
import config from '../../config/env';
import { getJwt } from '../../session';


const propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};

class AcceptInvitationPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(status) {
    this.setState({ loading: true });
    const { type, id } = this.props.match.params;
    const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
    const postBody = {
      accept: null
    };
    if (status === 'accept') {
      postBody.accept = true;
    } else {
      postBody.accept = false;
    }
    axios.post(`${config.hablaApiBaseUri}/${type}s/replyToInvite/${id}`, postBody, axiosOptions)
      .then(() => {
        if (type === 'subscriberOrg') {
          this.props.history.push(`/app/organization/${id}`);
        } else {
          this.props.history.push(`/app/${type}/${id}`);
        }
      }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { type } = this.props.match.params;
    let term = '';
    if (type === 'subscriberOrg') {
      term = 'Subscriber Organization';
    } else if (type === 'team') {
      term = 'Team';
    } else if (type === 'teamRoom') {
      term = 'Team Room';
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '200px' }}>
        {
          !this.state.loading ?
            <div>
              <h2 style={{ marginBottom: '20px' }}>You have been invited to join a {term}</h2>
              <Button
                onClick={() => this.handleClick('accept')}
                style={{ marginRight: '15px' }}
              >
                Accept Invitation
              </Button>
              <Button
                onClick={() => this.handleClick('decline')}
                style={{ marginLeft: '15px' }}
              >
                Decline Invitation
              </Button>
            </div> : <Spin size="large" />
        }
      </div>
    );
  }
}

AcceptInvitationPage.propTypes = propTypes;

export default withRouter(AcceptInvitationPage);
