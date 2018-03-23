import React, { Component } from 'react';
import { Form, message } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NewSubpageHeader from '../../components/NewSubpageHeader';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import Button from '../../components/common/Button';
import Spinner from '../../components/Spinner';
import './styles/style.css';
import String from '../../translations';

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
  updateSubscriberOrg: PropTypes.func.isRequired,
  subscriberOrgs: PropTypes.object.isRequired
};

const validURL = (url) => {
  let websiteUrl = url;
  if (websiteUrl.indexOf('http') === -1) {
    websiteUrl = `http://${url}`;
  }
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(websiteUrl);
};

class EditOrganizationPage extends Component {
  constructor(props) {
    super(props);

    const { match, subscriberOrgs } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || (match.params.subscriberOrgId !== subscriberOrgs.currentSubscriberOrgId)) {
      this.props.history.replace('/app');
      return;
    }

    const { subscriberOrgId } = this.props.match.params;
    let org = null;
    if (subscriberOrgs && subscriberOrgs.subscriberOrgById) {
      org = subscriberOrgs.subscriberOrgById[subscriberOrgId];
    }

    this.state = {
      loading: false,
      avatarBase64: (org && org.preferences) ? org.preferences.avatarBase64 : null,
      logo: (org && org.preferences) ? org.preferences.logo : null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleWebSiteBlur = this.handleWebSiteBlur.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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

  handleWebSiteBlur(e) {
    const faviconUrl = e.target.value;
    if (validURL(faviconUrl) && !this.state.avatarBase64) {
      // GET FAVICON URL
      this.setState({
        logo: `https://www.google.com/s2/favicons?domain=${faviconUrl}`
      });
    }
  }

  handleCancel() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.history.push(`/app/organization/${subscriberOrgId}`);
  }

  handleSubmit() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const dataToUpdate = {
          name: values.name.trim(),
          preferences: {
            webSite: values.webSite,
            logo: this.state.logo,
            avatarBase64: this.state.avatarBase64
          }
        };
        this.props.updateSubscriberOrg(dataToUpdate, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/organization/${subscriberOrgId}`);
            message.success(String.t('editOrgPage.organizationUpdated'));
          })
          .catch((error) => {
            this.setState({ loading: false });
            if (error.response && error.response.status === 409) {
              message.error(String.t('editOrgPage.errorNameAlreadyTaken'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  }

  render() {
    const { match, subscriberOrgs } = this.props;
    if (!match || !match.params || !match.params.subscriberOrgId || !subscriberOrgs) {
      return <Spinner />;
    }

    const { subscriberOrgId } = match.params;
    const organization = subscriberOrgs.subscriberOrgById[subscriberOrgId];
    if (!organization) {
      this.props.history.replace('/app');
      return null;
    }

    const containerImage = classNames({
      container__image: true,
      'with-image': this.state.logo || this.state.avatarBase64,
      'with-no-image': !this.state.avatarBase64 && !this.state.logo
    });
    return (
      <div className="editOrgPage-main">
        <NewSubpageHeader>
          <div className="subpage__header__title habla-title">{String.t('editOrgPage.title')}</div>
        </NewSubpageHeader>
        <div className="edit-org__subpage-body">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="edit-org__form padding-class-b">
              <div className="edit__container">
                <div>
                  <div className="edit__form__title habla-paragraph margin-bottom-class-a">{String.t('editOrgPage.organizationName')}</div>
                  <TextField
                    componentKey="name"
                    initialValue={organization.name}
                    inputClassName="edit__form__input"
                    form={this.props.form}
                    placeholder={String.t('editOrgPage.namePlaceholder')}
                    hasFeedback={false}
                    label=""
                    required
                  />
                </div>
                <div className="edit__container__image_wrapper">
                  <div className="edit__container__image__website">
                    <div className="edit__form__title habla-paragraph margin-bottom-class-a">{String.t('editOrgPage.webSiteLabel')}</div>
                    <TextField
                      componentKey="webSite"
                      initialValue={organization.preferences.webSite || ''}
                      inputClassName="edit__form__input"
                      form={this.props.form}
                      placeholder={String.t('editOrgPage.webSitePlaceholder')}
                      hasFeedback={false}
                      label=""
                      required
                      onBlur={this.handleWebSiteBlur}
                    />
                  </div>
                  <div className={containerImage}>
                    <UploadImageField
                      text={String.t('editOrgPage.changeAvatarText')}
                      onChange={this.handleChange}
                      image={this.state.avatarBase64 || this.state.logo}
                      editOrg
                      resize
                    />
                    {(this.state.avatarBase64 || this.state.logo) &&
                      <span
                        className="container__image__remove"
                        onClick={this.onRemoveImage}
                      >
                        {String.t('editOrgPage.removeImageLabel')}
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="edit-org__buttons border-top-lighter margin-top-class-a">
              <Button
                type="secondary"
                fitText
                className="margin-right-class-a"
                onClick={this.handleCancel}
              >
                {String.t('Buttons.cancel')}
              </Button>
              <Button
                type="main"
                fitText
                onClick={this.handleSubmit}
                loading={this.state.loading}
              >
                {String.t('editOrgPage.saveButtonLabel')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

EditOrganizationPage.propTypes = propTypes;

export default Form.create()(EditOrganizationPage);
