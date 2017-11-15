import React, { Component } from 'react';
import { Form, Button, notification } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import NewSubpageHeader from '../../components/NewSubpageHeader';
import UploadImageField from '../../components/formFields/UploadImageField';
import TextField from '../../components/formFields/TextField';
import { formShape } from '../../propTypes';
import { getJwt } from '../../session';
import messages from './messages';
import './styles/style.css';
import config from '../../config/env';

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
  const regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return regexp.test(url);
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
              message: messages.success,
              description: messages.organizationUpdated,
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
    return (
      <div>
        <NewSubpageHeader>
          <div className="subpage__header__title">{messages.title}</div>
        </NewSubpageHeader>
        <div className="edit-org__subpage-body">
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <div className="edit-org__form">
              <div className="edit__container">
                <div>
                  <div className="edit__form__title">{messages.organizationName}</div>
                  <TextField
                    componentKey="name"
                    initialValue={organization.name}
                    inputClassName="edit__form__input"
                    form={this.props.form}
                    placeholder="Organization name"
                    hasFeedback={false}
                    label=""
                    required
                  />
                </div>
                <div className="edit__container__image_wrapper">
                  <div className="edit__container__image__website">
                    <div className="edit__form__title">{messages.webSite}</div>
                    <TextField
                      componentKey="webSite"
                      initialValue={organization.preferences.webSite ? organization.preferences.webSite : 'https://'}
                      inputClassName="edit__form__input"
                      form={this.props.form}
                      placeholder="http://"
                      hasFeedback={false}
                      label=""
                      required
                      onBlur={this.handleWebSiteBlur}
                    />
                  </div>
                  <div className="container__image">
                    <UploadImageField
                      text={messages.changeAvatar}
                      onChange={this.handleChange}
                      editOrg
                      image={this.state.avatarBase64 || this.state.logo}
                    />
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
                { messages.cancel }
              </Button>
              <Button
                type="primary"
                className="Edit-team__button edit-org__button-active"
                onClick={this.handleSubmit}
                loading={this.state.loading}
              >
                { messages.save }
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
