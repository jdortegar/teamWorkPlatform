import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import String from 'src/translations';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      type: PropTypes.string,
      id: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.object.isRequired,
  invitations: PropTypes.array.isRequired,
  teamById: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  setCurrentSubscriberOrgId: PropTypes.func.isRequired
};

class AcceptInvitationPage extends Component {
  constructor(props) {
    super(props);
    this.handleInvitations();
  }

  componentDidUpdate = () => {
    this.handleInvitations();
  };

  handleInvitations() {
    const { invitations } = this.props;
    const { type, id } = this.props.match.params;
    if (invitations && invitations.length > 0) {
      const key = type === 'subscriberOrg' ? 'subscriberOrgId' : 'teamId';

      // if invitation active, show app home page which will have invitations at the top
      const matchingInvites = invitations.filter(inv => inv[key] === id);
      if (matchingInvites.length > 0) {
        this.props.history.push('/app');
        return;
      }
    }

    // if already added to the org or team, go to it.
    if (type === 'subscriberOrg') {
      if (this.props.subscriberOrgById[id]) {
        this.props.setCurrentSubscriberOrgId(id);
        this.props.history.push(`/app/organization/${id}`);
      }
    } else if (type === 'team') {
      if (this.props.teamById[id]) {
        this.props.history.push(`/app/team/${id}`);
      }
    }
  }

  render() {
    return (
      <div style={{ flex: 1, justifyContent: 'center' }}>
        <h2 style={{ textAlign: 'center' }}>{String.t('invalidInvitation')}</h2>
      </div>
    );
  }
}

AcceptInvitationPage.propTypes = propTypes;

export default withRouter(AcceptInvitationPage);
