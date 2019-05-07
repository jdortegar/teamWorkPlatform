import React, { Component } from 'react';
import { Form, message, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import {
  PageHeader,
  SimpleCardContainer,
  TextField,
  SwitchField,
  Spinner,
  Button,
  UploadImageField
} from 'src/components';
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
      teamId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  updateTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  orgId: PropTypes.string.isRequired
};

class EditTeamPage extends Component {
  constructor(props) {
    super(props);

    const { team } = this.props;

    this.state = {
      loading: false,
      avatarBase64: team && team.preferences ? team.preferences.avatarBase64 : null,
      logo: team && team.preferences ? team.preferences.logo : null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onRemoveImage = () => {
    this.setState({
      logo: null,
      avatarBase64: null
    });
  };

  handleChange = base64 => {
    this.setState({
      avatarBase64: base64
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    const { teamId } = this.props.match.params;
    const { orgId, team } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });

        const valuesToSend = {
          ...values,
          preferences: {
            logo: this.state.logo,
            avatarBase64: this.state.avatarBase64
          }
        };

        // Remove Name from object if the name is the same
        valuesToSend.name = valuesToSend.name === team.name ? undefined : valuesToSend.name.trim();

        this.props
          .updateTeam(orgId, teamId, valuesToSend)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.goBack();
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
    const { match, team, subscriberOrgById } = this.props;
    if (!match || !match.params || !match.params.teamId || !team || !subscriberOrgById) {
      return <Spinner />;
    }

    if (!team) {
      this.props.history.replace('/app');
      return null;
    }
    const subscriberOrg = subscriberOrgById[team.subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    const containerImage = classNames({
      container__image: true,
      'with-image': this.state.logo || this.state.avatarBase64,
      'with-no-image': !this.state.avatarBase64 && !this.state.logo
    });

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('TeamPage.editTeam')
        }
      ]
    };

    return (
      <div className="EditTeamPage-main">
        <PageHeader pageBreadCrumb={pageBreadCrumb} settingsIcon />
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <SimpleCardContainer className="subpage-block padding-class-a border-bottom-light container__team_image">
            <div className={containerImage}>
              <UploadImageField
                text={String.t('editOrgPage.changeAvatarText')}
                onChange={this.handleChange}
                image={this.state.avatarBase64 || this.state.logo}
                editOrg
                resize
              />
              {(this.state.avatarBase64 || this.state.logo) && (
                <span className="container__image__remove" onClick={this.onRemoveImage}>
                  {String.t('editOrgPage.removeImageLabel')}
                </span>
              )}
            </div>
            <span className="EditTeamPage_upload_label">{String.t('editOrgPage.changeAvatarText')}</span>
          </SimpleCardContainer>
          <SimpleCardContainer>
            <div className="New-team__container padding-class-a">
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
                      checkedChildren={String.t('on')}
                      unCheckedChildren={String.t('off')}
                      form={this.props.form}
                      componentKey="active"
                      initialValue={team.active}
                      valuePropName="checked"
                    />
                  </Tooltip>
                </div>
                <div className="New-team__title habla-secon">{String.t('editTeamPage.activeState')}</div>
              </div>
              <div className="Edit-team__icon-container">
                <div className="Edit-team__switch-container">
                  <Tooltip placement="top" title={String.t('newTeamPage.makePrivate')}>
                    <SwitchField
                      checkedChildren={String.t('on')}
                      unCheckedChildren={String.t('off')}
                      form={this.props.form}
                      componentKey="private"
                      initialValue={false}
                      valuePropName="checked"
                    />
                  </Tooltip>
                </div>
                <div className="New-team__title habla-secon">{String.t('editTeamPage.makePrivate')}</div>
              </div>
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
                {String.t('editTeamPage.saveButtonLabel')}
              </Button>
            </div>
          </SimpleCardContainer>
        </Form>
      </div>
    );
  }
}

EditTeamPage.propTypes = propTypes;

export default Form.create()(EditTeamPage);
