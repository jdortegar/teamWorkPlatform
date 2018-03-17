import React, { Component } from 'react';
import { Form, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import BreadCrumb from '../../components/BreadCrumb';
import AvatarWrapper from '../../components/common/Avatar/AvatarWrapper';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import Button from '../../components/common/Button';
import Spinner from '../../components/Spinner';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  inviteMembersToTeamRoom: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  teamRooms: PropTypes.object.isRequired,
  currentUserId: PropTypes.string.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  subscribers: PropTypes.array
};

const defaultProps = {
  subscribers: null
};

class InviteToTeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, invitees: [] };

    this.invitePressed = this.invitePressed.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  invitePressed(member) {
    const invitees = { ...this.state.invitees };
    if (this.state.invitees[member.userId]) { // found, so remove member
      delete invitees[member.userId];
      this.setState({ invitees });
    } else { // not found, so add member
      invitees[member.userId] = true;
      this.setState({ invitees });
    }
  }

  handleSubmit() {
    const { teamRoomId } = this.props.match.params;
    const users = Object.keys(this.state.invitees);
    this.setState({ loading: true });
    this.props.inviteMembersToTeamRoom(users, teamRoomId)
      .then(() => {
        this.setState({ loading: false });
        this.props.history.push(`/app/teamRoom/${teamRoomId}`);
        message.success(String.t('inviteToTeamRoomPage.invitationSent', { count: users.length }));
      })
      .catch((error) => {
        this.setState({ loading: false });
        if (error.response && error.response.status !== 202) {
          message.error(error.message);
        }
      });
  }

  renderInvitees(teamRoom) {
    const { currentUserId, subscribers } = this.props;
    return subscribers.map((member, index) => {
      const { userId, online } = member;
      if (userId === currentUserId) return null; // skip current user
      const isMember = member.teamRooms && (member.teamRooms[teamRoom.teamRoomId] !== undefined);
      const isPending = this.state.invitees[member.userId] != null;
      const avatarClassName = classNames({ 'opacity-low': !online });
      return (
        <div
          key={userId}
          className="habla-MemberListing__member-row"
          style={{ backgroundColor: ((index % 2) === 0) ? '#f4f4f4' : 'white' }}
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
          <a
            className="habla-MemberListing__inviteButton-text"
          >
            {!isMember && !isPending && String.t('inviteToTeamPage.inviteButtonLabel')}
            {(isMember || isPending) &&
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
            }
          </a>
        </div>
      );
    });
  }

  render() {
    const { subscribers, match, teamRooms, teams, subscriberOrgById, currentUserId } = this.props;
    if (!subscribers || !match || !match.params || !match.params.teamRoomId ||
        !teamRooms || !teams || !subscriberOrgById || !currentUserId) {
      return <Spinner />;
    }
    const { teamRoomId } = match.params;
    const teamRoom = teamRooms.teamRoomById[teamRoomId];
    if (!teamRoom) {
      this.props.history.replace('/app');
      return null;
    }
    const team = teams.teamById[teamRoom.teamId];
    if (!team) {
      this.props.history.replace('/app');
      return null;
    }
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    const instructions = String.t('inviteToTeamRoomPage.instructions', { name: teamRoom.name });
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
                {
                  title: teamRoom.name,
                  link: `/app/teamRoom/${teamRoomId}`
                },
                { title: String.t('inviteToTeamRoomPage.breadcrumb') }
              ]}
            />
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-a">
              <h1 className="habla-MemberListing__title mb-1">{instructions}</h1>
              {this.renderInvitees(teamRoom)}
            </div>
            <div className="edit-org__buttons border-top-light margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.push(`/app/teamRoom/${teamRoomId}`)}
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
                {String.t('inviteToTeamRoomPage.sendInvitationsButtonLabel', { count: Object.keys(this.state.invitees).length })}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

InviteToTeamRoomPage.propTypes = propTypes;
InviteToTeamRoomPage.defaultProps = defaultProps;

export default Form.create()(InviteToTeamRoomPage);
