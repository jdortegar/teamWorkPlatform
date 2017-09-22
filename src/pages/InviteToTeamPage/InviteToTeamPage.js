import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import AutoCompleteField from '../../components/formFields/AutoCompleteField/';
import { formShape } from '../../propTypes';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      teamId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  inviteMembersToTeam: PropTypes.func.isRequired
};

class InviteToTeamPage extends Component {
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
    const { teamId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const users = _.values(values);
        this.setState({ loading: true });
        this.props.inviteMembersToTeam(users)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/${teamId}/invitationSent`);
          });
      }
    });
  }

  renderInvitees() {
    const { teamId } = this.props.match.params;
    const { teams, subscriberOrgById, subscribers } = this.props;
    const subscriberOrgId = subscriberOrgById[teams.teamById[teamId].subscriberOrgId].subscriberOrgId;
    const users = subscribers[subscriberOrgId];
    const dataSource = users.map(({ firstName, lastName, displayName, userId }) => {
      return { text: `${displayName} - ${firstName} ${lastName}`, value: userId };
    });

    return this.state.inviteesArr.map((el) => {
      return (
        <Row key={el} gutter={16} type="flex" className="Invite-To-Team__email-row">
          <Col className="gutter-row" span={20}>
            <AutoCompleteField
              componentKey={`username${el}`}
              autoCompleteClassName="Invite-To-Team__textfield"
              form={this.props.form}
              placeholder={messages.enterUsername}
              label=""
              required
              dataSource={dataSource}
            />
          </Col>
          {
            this.state.inviteesArr.length > 1 ?
              <Col className="gutter-row" span={3}>
                <a onClick={() => this.removeInvitees(el)} className="remove-field">{messages.remove}</a>
              </Col> : null
          }
        </Row>
      );
    });
  }

  render() {
    const { teamId } = this.props.match.params;
    return (
      <div>
        <SubpageHeader breadcrumb="Team" />
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              <Col span={24}>
                <h1 className="Invite-To-Team__title">{messages.username}</h1>
              </Col>
            </Row>
            {this.renderInvitees()}
            <Row type="flex" justify="start" gutter={20}>
              <Col span={24} className="Invite-To-Team__add-another-container">
                <a onClick={this.addInvitees} className="Invite-To-Team__add-another">
                  <span>
                    <i className="fa fa-plus" />{messages.addAnother}
                  </span>
                </a>
              </Col>
              <Col span={24}>
                <div>
                  <Button
                    type="primary"
                    className="Invite-To-Team__button Invite-To-Team__button--margin-right"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                  >
                    { messages.sendInvitations }
                  </Button>
                  <Button
                    type="primary"
                    className="Invite-To-Team__button"
                    onClick={() => this.props.history.push(`/app/team/${teamId}`)}
                  >
                    { messages.cancel }
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

InviteToTeamPage.propTypes = propTypes;

export default Form.create()(InviteToTeamPage);
