import React, { Component } from 'react';
import { Form, notification, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import BreadCrumb from '../../components/BreadCrumb';
import SubpageHeader from '../../components/SubpageHeader';
import SimpleCardContainer from '../../components/SimpleCardContainer';
import TextField from '../../components/formFields/TextField';
import SwitchField from '../../components/formFields/SwitchField';
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
      teamId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateTeam: PropTypes.func.isRequired,
  teams: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired
};

class EditTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const { teamId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const valuesToSend = _.clone(values);
        valuesToSend.name = values.name.trim();
        this.props.updateTeam(valuesToSend, teamId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/${teamId}`);
            notification.open({
              message: String.t('editTeamPage.successToastTitle'),
              description: String.t('editTeamPage.teamUpdated'),
              duration: 4
            });
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (error.response.status === 409) {
              notification.open({
                message: String.t('errorToastTitle'),
                description: String.t('editTeamPage.errorNameAlreadyTaken'),
                duration: 4
              });
            } else {
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

  render() {
    const { teamId } = this.props.match.params;
    const { teams, subscriberOrgById } = this.props;
    const team = teams.teamById[teamId];
    // const teamIcon = `data:image/png;base64,${team.icon}`;
    const subscriberOrg = subscriberOrgById[teams.teamById[teamId].subscriberOrgId];

    return (
      <div className="EditTeamPage-main">
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
                }
              ]}
            />
          }
        />
        <SimpleCardContainer>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="padding-class-a">
              <div className="Edit-team__container">
                <h1 className="Edit-team__title">{String.t('editTeamPage.teamName')}</h1>
                <TextField
                  componentKey="name"
                  initialValue={team.name}
                  inputClassName="Edit-team__add-textfield"
                  form={this.props.form}
                  hasFeedback={false}
                  label=""
                  required
                />
              </div>
              <div className="Edit-team__icon-container">
                <div className="Edit-team__switch-container">
                  <Tooltip placement="top" title={team.active ? String.t('editTeamPage.setInactive') : String.t('editTeamPage.setActive')}>
                    <SwitchField
                      disabled={team.primary}
                      checkedChildren={String.t('editTeamPage.activeState')}
                      unCheckedChildren={String.t('editTeamPage.inactiveState')}
                      form={this.props.form}
                      componentKey="active"
                      initialValue={team.active}
                      valuePropName="checked"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
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
                {String.t('editTeamRoomPage.saveButtonLabel')}
              </Button>
            </div>
          </Form>
        </SimpleCardContainer>
      </div>
    );
  }
}

EditTeamPage.propTypes = propTypes;

export default Form.create()(EditTeamPage);
