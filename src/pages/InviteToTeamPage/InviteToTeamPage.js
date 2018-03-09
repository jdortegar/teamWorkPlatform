import React, { Component } from 'react';
import { Form, message } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import BreadCrumb from '../../components/BreadCrumb';
import AvatarWrapper from '../../components/common/Avatar/AvatarWrapper';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import { formShape } from '../../propTypes';
import Button from '../../components/common/Button';
import Spinner from '../../components/Spinner';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
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
  teams: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  subscribers: PropTypes.object.isRequired
};

class InviteToTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, inviteesArr: [0], dataSource: [] };

    this.invitePressed = this.invitePressed.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  invitePressed(member) {
    if (member) return;
    this.setState(previousState => ({
      inviteesArr: [...previousState.inviteesArr, member]
    }));
  }

  handleSubmit() {
    const { teamId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const users = _.values(values);
        this.setState({ loading: true });
        this.props.inviteMembersToTeam(users)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/${teamId}/invitationSent`);
            message.success(String.t('inviteToTeamPage.invitationSent', { count: users.length }));
          })
          .catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  }

  renderInvitees() {
    return this.props.subscribers.map((member, index) => {
      const { userId, online } = member;
      const avatarClassName = classNames({ 'opacity-low': !online });
      return (
        <div
          key={userId}
          className="Invite-To-Team__member-row"
          style={{ backgroundColor: ((index % 2) === 0) ? '#f4f4f4' : 'white' }}
        >
          <div className="Invite-To-Team__member-image">
            <AvatarWrapper key={userId} user={member} size="default" className={avatarClassName} />
          </div>
          <div className="Invite-To-Team__member-text">
            <div>{String.t('inviteToTeamPage.membersListItem', member)}</div>
          </div>
          <a className="Invite-To-Team__inviteButton-text">
            {String.t('inviteToTeamPage.inviteButtonLabel')}
          </a>
          <div
            claseName="Invite-To-Team-InviteButton"
            onClick={() => this.invitePressed(member)}
          >
            <i className="fas fa-check-circle" style={{ color: '#32a953', fontSize: 20 }} />
          </div>
        </div>
      );
    });
  }

  render() {
    const { subscribers, match, teams, subscriberOrgById } = this.props;
    if (!subscribers || !match || !match.params || !match.params.teamId ||
        !teams || !subscriberOrgById) {
      return <Spinner />;
    }
    const { teamId } = match.params;
    const team = teams.teamById[teamId];
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
              <h1 className="Invite-To-Team__title mb-1">{instructions}</h1>
              {this.renderInvitees()}
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
              >
                {String.t('inviteToTeamPage.sendInvitationsButtonLabel', { count: this.state.inviteesArr.length })}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

InviteToTeamPage.propTypes = propTypes;

export default Form.create()(InviteToTeamPage);
