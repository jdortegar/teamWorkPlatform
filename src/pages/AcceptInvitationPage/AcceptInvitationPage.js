import React, { Component } from 'react';
import { Spin } from 'antd';
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
  }).isRequired,
  location: PropTypes.object
};

class AcceptInvitationPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, invitation: props.invitation, error: false };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    if (!this.state.invitation) {
      const axiosOptions = { headers: { Authorization: `Bearer ${getJwt()}` } };
      const url = this.props.location.pathname;
      const id = url.substr(url.lastIndexOf('/') + 1);
      let key;
      if (url.indexOf('subscriberOrg') > 0) {
        key = 'subscriberOrgId';
      } else {
        key = (url.indexOf('teamRoom') > 0) ? 'teamRoomId' : 'teamId';
      }

      axios.get(`${config.hablaApiBaseUri}/users/getInvitations`, axiosOptions)
        .then((response) => {
          let setError = true;
          if (response.status === 200) {
            const invitations = response.data.invitations;
            if (invitations && invitations.length > 0) {
              const matchingInvites = invitations.filter(inv => inv[key] === id);
              if (matchingInvites.length > 0) {
                setError = false;
                this.setState({ invitation: matchingInvites[0] });
              }
            }
          }
          if (setError) {
            this.setState({ error: true });
          }
        })
        .catch(() => {
          this.setState({ error: true });
        });
    }
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
    if (this.state.error) {
      return (
        <div style={{ flex: 1, justifyContent: 'center' }}>
          <h2 style={{ textAlign: 'center' }}>{String.t('invalidInvitation')}</h2>
        </div>
      );
    }

    if (!this.state.invitation) {
      return <div style={{ flex: 1, justifyContent: 'center' }}><Spin /></div>;
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '200px' }}>
        {this.state.loading && <Spin size="large" />}
      </div>
    );
  }
}

AcceptInvitationPage.propTypes = propTypes;

AcceptInvitationPage.defaultProps = {
  location: null
};

export default withRouter(AcceptInvitationPage);
