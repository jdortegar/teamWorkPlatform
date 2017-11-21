import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import { withRouter } from 'react-router';
import axios from 'axios';
import PropTypes from 'prop-types';
import config from '../../config/env';
import { getJwt } from '../../session';
import String from '../../translations';

const propTypes = {
  invitation: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    })
  }).isRequired
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
          window.location.href = `/app/organization/${id}`;
        } else {
          window.location.href = `/app/${type}/${id}`;
        }
      }).catch(() => this.setState({ loading: false }));
  }

  render() {
    const { type } = this.props.match.params;
    let msg = '';
    if (type === 'subscriberOrg') {
      msg = String.t('msgInvitationToOrg', this.props.invitation);
    } else if (type === 'team') {
      msg = String.t('msgInvitationToTeam', this.props.invitation);
    } else if (type === 'teamRoom') {
      msg = String.t('msgInvitationToTeamRoom', this.props.invitation);
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '200px' }}>
        {
          !this.state.loading ?
            <div>
              <h2 style={{ marginBottom: '20px' }}>{msg}</h2>
              <Button
                onClick={() => this.handleClick('accept')}
                style={{ marginRight: '15px' }}
              >
                {String.t('buttonAcceptInvitation')}
              </Button>
              <Button
                onClick={() => this.handleClick('decline')}
                style={{ marginLeft: '15px' }}
              >
                {String.t('buttonDeclineInvitation')}
              </Button>
            </div> : <Spin size="large" />
        }
      </div>
    );
  }
}

AcceptInvitationPage.propTypes = propTypes;

export default withRouter(AcceptInvitationPage);
