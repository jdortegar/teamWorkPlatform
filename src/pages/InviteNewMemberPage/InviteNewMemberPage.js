import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import EmailField from '../../components/formFields/EmailField';
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
      subscriberOrgId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
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
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, emails) => {
      if (!err) {
        const users = _.values(emails);
        this.setState({ loading: true });
        this.props.inviteNewSubscribers(users, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/organization/${subscriberOrgId}/invitationSent`);
          });
      }
    });
  }

  renderInvitees() {
    return this.state.inviteesArr.map((el) => {
      return (
        <Row key={el} gutter={16} type="flex" className="Invite-New-Member__email-row">
          <Col className="gutter-row" span={20}>
            <EmailField
              componentKey={`email${el}`}
              inputClassName="Invite-New-Member__email-field"
              form={this.props.form}
              placeholder=" "
              label=""
              required
            />
          </Col>
          {
            this.state.inviteesArr.length > 1 ?
              <Col className="gutter-row" span={3}>
                <a onClick={() => this.removeInvitees(el)} className="remove-field">Remove</a>
              </Col> : null
          }
        </Row>
      );
    });
  }

  render() {
    const { subscriberOrgId } = this.props.match.params;
    return (
      <div>
        <SubpageHeader breadcrumb={String.t('inviteNewMemberPage.breadcrumb')} />
        <SimpleCardContainer className="subpage-block">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" justify="start" gutter={20}>
              <Col span={24}>
                <h1 className="Invite-New-Member__title">{String.t('inviteNewMemberPage.title')}</h1>
              </Col>
            </Row>
            {this.renderInvitees()}
            <Row type="flex" justify="start" gutter={20}>
              <Col span={24} className="Invite-New-Member__add-another-container">
                <a onClick={this.addInvitees} className="Invite-New-Member__add-another">
                  <span>
                    <i className="fa fa-plus" />Add another
                  </span>
                </a>
              </Col>
              <Col span={24}>
                <div>
                  <Button
                    type="primary"
                    className="Invite-New-Member__button Invite-New-Member__button--margin-right"
                    onClick={this.handleSubmit}
                    loading={this.state.loading}
                  >
                    {String.t('inviteNewMemberPage.sendInvitationsButtonLabel')}
                  </Button>
                  <Button
                    type="primary"
                    className="Invite-New-Member__button"
                    onClick={() => this.props.history.push(`/app/organization/${subscriberOrgId}`)}
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

InviteNewMemberPage.propTypes = propTypes;

export default Form.create()(InviteNewMemberPage);
