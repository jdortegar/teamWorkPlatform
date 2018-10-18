import React, { Component } from 'react';
import { Form, message, Tooltip } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { PageHeader, SimpleCardContainer, TextField, SwitchField, Spinner, Button } from 'src/components';
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

  handleSubmit(e) {
    e.preventDefault();
    const { teamId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const valuesToSend = { ...values };
        valuesToSend.name = values.name.trim();
        this.props
          .updateTeam(valuesToSend, teamId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/team/manage/${teamId}`);
            message.success(String.t('editTeamPage.teamUpdated'));
          })
          .catch(error => {
            this.setState({ loading: false });
            if (error.response && error.response.status === 409) {
              message.error(String.t('editTeamPage.errorNameAlreadyTaken'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  }

  render() {
    const { match, teams, subscriberOrgById } = this.props;
    if (!match || !match.params || !match.params.teamId || !teams || !subscriberOrgById) {
      return <Spinner />;
    }

    const { teamId } = this.props.match.params;

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

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: team.name,
          url: `/app/team/${team.subscriberOrgId}`
        },
        {
          title: String.t('TeamPage.editTeam')
        }
      ]
    };

    // Page Menu
    const menuPageHeader = [
      {
        icon: 'fas fa-cloud-download-alt',
        title: 'TeamPage.addDataIntegration',
        url: ''
      },
      {
        icon: 'fas fa-pencil-alt',
        title: 'TeamPage.editTeam',
        url: `/app/editTeam/${teamId}`
      }
    ];

    return (
      <div className="EditTeamPage-main">
        <PageHeader pageBreadCrumb={pageBreadCrumb} hasMenu={false} menuPageHeader={menuPageHeader} />
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
                  <Tooltip
                    placement="top"
                    title={team.active ? String.t('editTeamPage.setInactive') : String.t('editTeamPage.setActive')}
                  >
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
                onClick={() => this.props.history.push(`/app/team/manage/${teamId}`)}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button type="main" fitText onClick={this.handleSubmit} loading={this.state.loading}>
                {String.t('editTeamPage.saveButtonLabel')}
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
