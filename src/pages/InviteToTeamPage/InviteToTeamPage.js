import React, { Component } from 'react';
import { Form, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import String from 'src/translations';
import { BreadCrumb, AvatarWrapper, SubpageHeader, SimpleCardContainer, Button, Spinner } from 'src/components';
import './styles/style.css';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  inviteMembersToTeam: PropTypes.func.isRequired,
  fetchSentInvitations: PropTypes.func.isRequired,
  sentInvitations: PropTypes.object,
  teams: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  subscribersPresences: PropTypes.object,
  subscribers: PropTypes.array
};

const defaultProps = {
  sentInvitations: null,
  subscribersPresences: null,
  subscribers: null
};

class InviteToTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, invitees: [] };

    this.invitePressed = this.invitePressed.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.fetchSentInvitations(null);
  }

  invitePressed(member) {
    const invitees = { ...this.state.invitees };
    if (this.state.invitees[member.userId]) {
      // found, so remove member
      delete invitees[member.userId];
      this.setState({ invitees });
    } else {
      // not found, so add member
      invitees[member.userId] = true;
      this.setState({ invitees });
    }
  }

  handleSubmit() {
    const { teamId } = this.props.match.params;
    const users = Object.keys(this.state.invitees);
    this.setState({ loading: true });
    this.props
      .inviteMembersToTeam(users)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push(`/app/team/${teamId}`);
        message.success(String.t('inviteToTeamPage.invitationSent', { count: users.length }));
      })
      .catch(error => {
        this.setState({ loading: false });
        message.error(error.message);
      });
  }

  renderInvitees(team) {
    const { currentUserId, subscribers, subscribersPresences, sentInvitations } = this.props;
    const orgSubscribers = subscribers.map(subscriber => ({
      ...subscriber,
      online: _.some(_.values(subscribersPresences[subscriber.userId]), { presenceStatus: 'online' })
    }));
    const subscribersWithoutCurrentUser = orgSubscribers.filter(sub => sub.userId !== currentUserId);
    return subscribersWithoutCurrentUser.map((member, index) => {
      const { userId, online } = member;
      const sentPendingInvitesForUser = _.find(sentInvitations.pending, {
        inviteeUserId: userId,
        teamId: team.teamId
      });
      const isMember = member.teams && member.teams[team.teamId] !== undefined;
      const isPending = this.state.invitees[member.userId] != null;
      let inviteLabel = '';
      if (!isMember && !isPending) {
        inviteLabel = !sentPendingInvitesForUser
          ? String.t('inviteToTeamPage.inviteButtonLabel')
          : String.t('inviteToTeamPage.reInviteButtonLabel');
      }

      const avatarClassName = classNames({ 'opacity-low': !online });
      return (
        <div
          key={userId}
          className="habla-MemberListing__member-row"
          style={{ backgroundColor: index % 2 === 0 ? '#f4f4f4' : 'white' }}
          onClick={() => {
            if (!isMember) {
              this.invitePressed(member);
            }
          }}
        >
          <div className="habla-MemberListing__member-image">
            <AvatarWrapper key={userId} user={member} size="default" className={avatarClassName} />
          </div>
          <div className="habla-MemberListing__member-text" style={{ color: isPending ? '#32a953' : '#666' }}>
            {String.t('inviteToTeamPage.membersListItem', member)}
          </div>
          <a className="habla-MemberListing__inviteButton-text">
            {inviteLabel}
            {(isMember || isPending) && (
              <div>
                <i
                  className={isMember ? 'far fa-check-circle' : 'fas fa-check'}
                  style={{
                    color: isMember ? 'black' : '#32a953',
                    opacity: isMember ? 0.3 : 1.0,
                    fontSize: isMember ? 22 : 20
                  }}
                />
              </div>
            )}
          </a>
        </div>
      );
    });
  }

  render() {
    const {
      subscribers,
      match,
      teams,
      subscriberOrgById,
      currentUserId,
      subscribersPresences,
      sentInvitations
    } = this.props;
    if (
      !subscribers ||
      !match ||
      !match.params ||
      !match.params.teamId ||
      !teams ||
      !subscriberOrgById ||
      !currentUserId ||
      !subscribersPresences ||
      !sentInvitations ||
      !sentInvitations.pending
    ) {
      return <Spinner />;
    }

    const { teamId } = match.params;
    const team = teams[teamId];
    if (!team) {
      this.props.history.replace('/app');
      return null;
    }
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    const instructions = String.t('inviteToTeamPage.instructions', { name: team.name });
    return (
      <div>
        <SubpageHeader
          subscriberOrgId={subscriberOrg.subscriberOrgId}
          history={this.props.history}
          breadcrumb={
            <BreadCrumb
              subscriberOrg={subscriberOrg}
              routes={[
                {
                  title: subscriberOrg.name,
                  link: `/app/organization/${subscriberOrg.subscriberOrgId}`
                },
                {
                  title: team.name,
                  link: `/app/team/${team.teamId}`
                },
                { title: String.t('inviteToTeamPage.breadcrumb') }
              ]}
            />
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-a">
              <h1 className="habla-MemberListing__title mb-1">{instructions}</h1>
              {this.renderInvitees(team)}
            </div>
            <div className="edit-org__buttons border-top-light margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.push(`/app/team/${teamId}`)}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button
                type="main"
                fitText
                onClick={this.handleSubmit}
                loading={this.state.loading}
                disabled={Object.keys(this.state.invitees).length === 0}
              >
                {String.t('inviteToTeamPage.sendInvitationsButtonLabel', {
                  count: Object.keys(this.state.invitees).length
                })}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

InviteToTeamPage.propTypes = propTypes;
InviteToTeamPage.defaultProps = defaultProps;

export default Form.create()(InviteToTeamPage);
