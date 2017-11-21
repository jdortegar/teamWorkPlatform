import React, { Component } from 'react';
import { Form, Button, notification } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NewSubpageHeader from '../../components/NewSubpageHeader';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import { getJwt } from '../../session';
import './styles/style.css';
import config from '../../config/env';
import String from '../../translations';

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
    const { subscriberOrgId } = this.props.match.params;
    const { subscriberOrgs } = this.props;
    this.organization = subscriberOrgs.subscriberOrgById[subscriberOrgId];

    this.state = {
      loading: false,
      avatarBase64: this.organization.preferences.avatarBase64 || '',
      logo: this.organization.preferences.logo || ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleWebSiteBlur = this.handleWebSiteBlur.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  onRemoveImage() {
    const { subscriberOrgId } = this.props.match.params;
    const axiosOptions = {
      headers: {
        Authorization: `Bearer ${getJwt()}`
      }
    };
    const dataToUpdate = {
      preferences: {
        logo: null,
        avatarBase64: null
      }
    };
    axios.patch(`${config.hablaApiBaseUri}/subscriberOrgs/updateSubscriberOrg/${subscriberOrgId}`, dataToUpdate, axiosOptions)
      .then(() => {
        this.setState({
          logo: '',
          avatarBase64: ''
        });
      });
  }

  handleChange(base64) {
    const { subscriberOrgId } = this.props.match.params;
    const axiosOptions = {
      headers: {
        Authorization: `Bearer ${getJwt()}`
      }
    };
    const dataToUpdate = {
      preferences: {
        avatarBase64: base64
      }
    };
    axios.patch(`${config.hablaApiBaseUri}/subscriberOrgs/updateSubscriberOrg/${subscriberOrgId}`, dataToUpdate, axiosOptions)
      .then(() => {
        this.setState({
          avatarBase64: base64
        });
      });
  }

  handleWebSiteBlur(e) {
    const { subscriberOrgId } = this.props.match.params;
    const faviconUrl = e.target.value;
    if (validURL(faviconUrl) && !this.state.avatarBase64) {
      // GET FAVICON URL
      const axiosOptions = {
        headers: {
          Authorization: `Bearer ${getJwt()}`
        }
      };
      const dataToUpdate = {
        preferences: {
          logo: `https://www.google.com/s2/favicons?domain=${faviconUrl}`
        }
      };
      axios.patch(`${config.hablaApiBaseUri}/subscriberOrgs/updateSubscriberOrg/${subscriberOrgId}`, dataToUpdate, axiosOptions)
        .then(() => {
          this.setState({
            logo: `https://www.google.com/s2/favicons?domain=${faviconUrl}`
          });
        });
    }
  }

  handleSubmit() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const dataToUpdate = {
          name: values.name,
          preferences: {
            webSite: values.webSite
          }
        };
        this.props.updateSubscriberOrg(dataToUpdate, subscriberOrgId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push(`/app/organization/${subscriberOrgId}`);
            notification.open({
              message: String.t('editOrgPage.successToastTitle'),
              description: String.t('editOrgPage.organizationUpdated'),
              duration: 4
            });
          });
      }
    });
  }

  render() {
    const { subscriberOrgId } = this.props.match.params;
    const { subscriberOrgs } = this.props;
    const organization = subscriberOrgs.subscriberOrgById[subscriberOrgId];
    const containerImage = classNames({
      container__image: true,
      'with-image': this.state.logo || this.state.avatarBase64,
      'with-no-image': !this.state.avatarBase64 && !this.state.logo
    });
    return (
      <div>
        <NewSubpageHeader>
          <div className="subpage__header__title">{String.t('editOrgPage.title')}</div>
        </NewSubpageHeader>
        <div className="edit-org__subpage-body">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="edit-org__form">
              <div className="edit__container">
                <div>
                  <div className="edit__form__title">{String.t('editOrgPage.organizationName')}</div>
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
                    <div className="edit__form__title">{String.t('editOrgPage.webSiteLabel')}</div>
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
                        Remove
                      </span>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="edit-org__buttons">
              <Button
                type="primary"
                className="Edit-team__button New-team__button--margin-right"
                onClick={() => this.props.history.push(`/app/organization/${subscriberOrgId}`)}
              >
                {String.t('cancelButton')}
              </Button>
              <Button
                type="primary"
                className="Edit-team__button edit-org__button-active"
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
