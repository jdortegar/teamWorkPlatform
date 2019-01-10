import React, { Component } from 'react';
import { Row, Col, Form, message } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { PageHeader, SimpleCardContainer, EmailField, Spinner, Button } from 'src/components';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  inviteNewSubscribers: PropTypes.func.isRequired
};

class InviteNewMemberPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, invitees: 0, inviteesArr: [0] };

    this.addInvitees = this.addInvitees.bind(this);
    this.removeInvitees = this.removeInvitees.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addInvitees() {
    if (this.state.invitees < 5) {
      this.setState(previousState => ({
        invitees: previousState.invitees + 1,
        inviteesArr: [...previousState.inviteesArr, previousState.invitees + 1]
      }));
    }
  }

  removeInvitees(field) {
    const updatedInvitees = this.state.inviteesArr.filter(el => el !== field);

    this.setState({ inviteesArr: updatedInvitees });
  }

  handleSubmit() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, emails) => {
      if (!err) {
        const users = _.values(emails);
        this.setState({ loading: true });
        this.props
          .inviteNewSubscribers(users, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.goBack();
            message.success(String.t('inviteNewMemberPage.invitationSent', { count: users.length }));
          })
          .catch(error => {
            this.setState({ loading: false });
            if (error.response && error.response.status === 409) {
              message.error(String.t('inviteNewMemberPage.errorUserhasOtherOrg'));
            } else if (error.response && error.response.status === 403) {
              message.error(String.t('inviteNewMemberPage.errorUserLimit'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  }

  renderInvitees() {
    return this.state.inviteesArr.map((el, index) => (
      <Row key={el} gutter={16} type="flex" className="Invite-New-Member__email-row">
        <Col className="gutter-row" span={20}>
          <EmailField
            componentKey={`email${el}`}
            inputClassName="Invite-New-Member__email-field"
            form={this.props.form}
            placeholder=" "
            label=""
            required
            autoFocus={index === this.state.inviteesArr.length - 1}
          />
        </Col>
        {this.state.inviteesArr.length > 1 ? (
          <Col className="gutter-row" span={3}>
            <a onClick={() => this.removeInvitees(el)} className="remove-field">
              <i className="fas fa-times" />
            </a>
          </Col>
        ) : null}
      </Row>
    ));
  }

  render() {
    const { match, subscriberOrgById } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || !subscriberOrgById) {
      return <Spinner />;
    }
    const { subscriberOrgId } = match.params;
    const subscriberOrg = this.props.subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('inviteNewMemberPage.title')
        }
      ]
    };

    return (
      <div>
        <PageHeader pageBreadCrumb={pageBreadCrumb} settingsIcon />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-a">
              <h1 className="Invite-New-Member__title">{String.t('inviteNewMemberPage.userEmail')}</h1>
              {this.renderInvitees()}
            </div>
            <div className="inviteMoreUsersLink">
              <a onClick={this.addInvitees} className="Invite-New-Member__add-another">
                <span>
                  <i className="fa fa-plus-circle margin-right-class-a" />
                  {String.t('inviteNewMemberPage.addEmail')}
                </span>
              </a>
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.goBack()}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button type="main" fitText onClick={this.handleSubmit} loading={this.state.loading}>
                {String.t('inviteNewMemberPage.sendInvitationsButtonLabel', { count: this.state.inviteesArr.length })}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

InviteNewMemberPage.propTypes = propTypes;

export default Form.create()(InviteNewMemberPage);
