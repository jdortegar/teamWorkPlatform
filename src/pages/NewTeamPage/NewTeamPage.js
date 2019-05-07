import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Form, message, Tooltip } from 'antd';
import String from 'src/translations';
import { formShape } from 'src/propTypes';
import {
  SimpleCardContainer,
  TextField,
  Spinner,
  Button,
  PageHeader,
  UploadImageField,
  SwitchField
} from 'src/components';
import './styles/style.css';
// import { EINPROGRESS } from 'constants';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      subscriberOrgId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  subscriberOrgById: PropTypes.object.isRequired,
  createTeam: PropTypes.func.isRequired
};

class NewTeamPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      avatarBase64: null,
      logo: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  onRemoveImage() {
    this.setState({
      logo: null,
      avatarBase64: null
    });
  }

  handleChange(base64) {
    this.setState({
      avatarBase64: base64
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const valuesToSend = {
          ...values,
          preferences: {
            logo: this.state.logo,
            avatarBase64: this.state.avatarBase64,
            public: !values.public
          }
        };
        valuesToSend.name = values.name.trim();
        delete valuesToSend.public;
        this.setState({ loading: true });
        this.props
          .createTeam(valuesToSend, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/organization/${subscriberOrgId}`);
            message.success(String.t('newTeamPage.teamAddedToast'));
          })
          .catch(error => {
            this.setState({ loading: false });
            if (error.response && error.response.status === 409) {
              message.error(String.t('addTeamDialog.errorNameAlreadyTaken'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  }

  render() {
    const { match, subscriberOrgById } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || !subscriberOrgById) {
      return <Spinner />;
    }

    const { subscriberOrgId } = match.params;
    const subscriberOrg = subscriberOrgById[subscriberOrgId];
    if (!subscriberOrg) {
      this.props.history.replace('/app');
      return null;
    }

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('newTeamPage.breadcrumb')
        }
      ]
    };

    const containerImage = classNames({
      container__image: true,
      'with-image': this.state.logo || this.state.avatarBase64,
      'with-no-image': !this.state.avatarBase64 && !this.state.logo
    });

    return (
      <div>
        <PageHeader pageBreadCrumb={pageBreadCrumb} settingsIcon backButton />
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
              <div className="New-team__title habla-secon">{String.t('newTeamPage.chooseTeamName')}</div>
              <TextField
                componentKey="name"
                inputClassName="New-team__add-textfield"
                form={this.props.form}
                hasFeedback={false}
                placeholder=""
                label=""
                required
                autoFocus
              />
              <div className="Edit-team__icon-container">
                <div className="Edit-team__switch-container">
                  <Tooltip placement="top" title={String.t('newTeamPage.makePrivate')}>
                    <SwitchField
                      checkedChildren={String.t('on')}
                      unCheckedChildren={String.t('off')}
                      form={this.props.form}
                      componentKey="public"
                      initialValue={false}
                      valuePropName="checked"
                    />
                  </Tooltip>
                </div>
                <div className="New-team__title habla-secon">{String.t('newTeamPage.makePrivate')}</div>
              </div>
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={() => this.props.history.push(`/app/organization/${subscriberOrgId}`)}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button type="main" fitText onClick={this.handleSubmit} loading={this.state.loading}>
                {String.t('newTeamPage.createNewTeamButtonLabel')}
              </Button>
            </div>
          </SimpleCardContainer>
        </Form>
      </div>
    );
  }
}

NewTeamPage.propTypes = propTypes;

export default Form.create()(NewTeamPage);
