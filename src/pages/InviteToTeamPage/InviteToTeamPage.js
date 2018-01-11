import React, { Component } from 'react';
import { Row, Col, Form, Button, notification } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import AutoCompleteField from '../../components/formFields/AutoCompleteField/';
import { formShape } from '../../propTypes';
import String from '../../translations';
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
  inviteMembersToTeam: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  subscribers: PropTypes.object.isRequired
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
            notification.open({
              message: String.t('successToastTitle'),
              description: String.t('inviteToTeamPage.invitationSent', { count: users.length }),
              duration: 4
            });
          })
          .catch(() => {
            this.setState({ loading: false });
            notification.open({
              message: String.t('inviteToTeamPage.errorToastTitle'),
              description: String.t('inviteToTeamPage.errorToastMessage'),
              duration: 4
            });
          });
      }
    });
  }

  renderInvitees() {
    const users = this.props.subscribers;
    const { teamId } = this.props.match.params;
    const dataSource = users.reduce((acc, { firstName, lastName, displayName, userId, teams }) => {
      if (!teams[teamId]) {
        acc.push({ text: `${displayName} - ${firstName} ${lastName}`, value: userId });
      }
      return acc;
    }, []);

    return this.state.inviteesArr.map((el) => {
      return (
        <Row key={el} gutter={16} type="flex" className="Invite-To-Team__email-row">
          <Col className="gutter-row" span={20}>
            <AutoCompleteField
              componentKey={`username${el}`}
              autoCompleteClassName="Invite-To-Team__textfield"
              form={this.props.form}
              placeholder={String.t('inviteToTeamPage.usernamePlaceholder')}
              label=""
              required
              dataSource={dataSource}
            />
          </Col>
          {
            this.state.inviteesArr.length > 1 ?
              <Col className="gutter-row" span={3}>
                <a onClick={() => this.removeInvitees(el)} className="remove-field">{String.t('inviteToTeamPage.removeLink')}</a>
              </Col> : null
          }
        </Row>
      );
    });
  }

  render() {
    const { teams, subscriberOrgById } = this.props;
    const { teamId } = this.props.match.params;
    const team = teams.teamById[teamId];
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
    return (
      <div>
        <SubpageHeader
          breadcrumb={
            <BreadCrumb routes={[
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
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              <Col span={24}>
                <h1 className="Invite-To-Team__title">{String.t('inviteToTeamPage.username')}</h1>
              </Col>
            </Row>
            {this.renderInvitees()}
            <Row type="flex" justify="start" gutter={20}>
              <Col span={24} className="Invite-To-Team__add-another-container">
                <a onClick={this.addInvitees} className="Invite-To-Team__add-another">
                  <span>
                    <i className="fa fa-plus" />{String.t('inviteToTeamPage.addAnother')}
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
                    {String.t('inviteToTeamPage.sendInvitationsButtonLabel', { count: this.state.inviteesArr.length })}
                  </Button>
                  <Button
                    type="primary"
                    className="Invite-To-Team__button"
                    onClick={() => this.props.history.push(`/app/team/${teamId}`)}
                  >
                    {String.t('cancelButton')}
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
