import React, { Component } from 'react';
import { Row, Col, Form, notification } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import AutoCompleteField from '../../components/formFields/AutoCompleteField/';
import { formShape } from '../../propTypes';
import Button from '../../components/common/Button';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamRoomId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  inviteMembersToTeamRoom: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  teamRooms: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  subscribers: PropTypes.object.isRequired
};

class InviteToTeamRoomPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, invitees: 0, inviteesArr: [0], dataSource: [] };

    this.addInvitees = this.addInvitees.bind(this);
    this.removeInvitees = this.removeInvitees.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addInvitees() {
    if (this.state.invitees < 5) {
      this.setState(previousState => ({ invitees: previousState.invitees + 1, inviteesArr: [...previousState.inviteesArr, previousState.invitees + 1] }));
    }
  }

  removeInvitees(field) {
    const updatedInvitees = this.state.inviteesArr.filter((el) => {
      return el !== field;
    });

    this.setState({ inviteesArr: updatedInvitees });
  }

  handleSubmit() {
    const { teamRoomId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const users = _.values(values);
        this.setState({ loading: true });
        this.props.inviteMembersToTeamRoom(users, teamRoomId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/teamRoom/${teamRoomId}`);
            notification.open({
              message: String.t('successToastTitle'),
              description: String.t('inviteToTeamRoomPage.invitationSent', { count: users.length }),
              duration: 4
            });
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (error.response && error.response.status !== 202) {
              notification.open({
                message: String.t('errorToastTitle'),
                description: error.message,
                duration: 4
              });
            }
          });
      }
    });
  }

  renderInvitees() {
    const users = this.props.subscribers;
    const { teamRoomId } = this.props.match.params;
    const dataSource = users.reduce((acc, { firstName, lastName, displayName, userId, teamRooms }) => {
      if (!teamRooms[teamRoomId]) {
        acc.push({ text: `${displayName} - ${firstName} ${lastName}`, value: userId });
      }
      return acc;
    }, []);

    return this.state.inviteesArr.map((el) => {
      return (
        <Row key={el} gutter={16} type="flex" className="Invite-To-TeamRoom__email-row">
          <Col className="gutter-row" span={20}>
            <AutoCompleteField
              componentKey={`username${el}`}
              autoCompleteClassName="Invite-To-TeamRoom__textfield"
              form={this.props.form}
              placeholder={String.t('inviteToTeamRoomPage.usernamePlaceholder')}
              label=""
              required
              dataSource={dataSource}
            />
          </Col>
          {
            this.state.inviteesArr.length > 1 ?
              <Col className="gutter-row" span={3}>
                <a onClick={() => this.removeInvitees(el)} className="remove-field">{String.t('inviteToTeamRoomPage.removeLink')}</a>
              </Col> : null
          }
        </Row>
      );
    });
  }

  render() {
    const { teamRoomId } = this.props.match.params;
    const { teamRooms, teams, subscriberOrgById } = this.props;
    const teamRoom = teamRooms.teamRoomById[teamRoomId];
    const team = teams.teamById[teamRoom.teamId];
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];

    return (
      <div>
        <SubpageHeader
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
              <h1 className="Invite-To-TeamRoom__title">{String.t('inviteToTeamRoomPage.username')}</h1>
              {this.renderInvitees()}
            </div>
            <div className="padding-class-a">
              <a onClick={this.addInvitees} className="Invite-To-TeamRoom__add-another">
                <span>
                  <i className="fa fa-plus-circle margin-right-class-a" />{String.t('inviteToTeamRoomPage.addAnother')}
                </span>
              </a>
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
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
              >
                {String.t('inviteToTeamRoomPage.sendInvitationsButtonLabel', { count: this.state.inviteesArr.length })}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

InviteToTeamRoomPage.propTypes = propTypes;

export default Form.create()(InviteToTeamRoomPage);
