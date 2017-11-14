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

class EditOrganizationPage extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(base64) {
    const { subscriberOrgId } = this.props.match.params;
    const axiosOptions = {
      headers: {
        Authorization: `Bearer ${getJwt()}`
      }
    };
    axios.patch(`${config.hablaApiBaseUri}/subscriberOrgs/updateSubscriberOrg/${subscriberOrgId}`, { icon: base64 }, axiosOptions);
  }

  handleSubmit() {
    const { subscriberOrgId } = this.props.match.params;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const dataToUpdate = {
          name: values.name,
          preferences: {
            website: values.website
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
                      componentKey="website"
                      initialValue={organization.preferences.website ? organization.preferences.website : ''}
                      inputClassName="edit__form__input"
                      form={this.props.form}
                      placeholder="http://"
                      hasFeedback={false}
                      label=""
                      required
                    />
                  </div>
                  <div className="container__image">
                    <UploadImageField
                      text={messages.changeAvatar}
                      onChange={this.handleChange}
                      editOrg
                      image={organization.icon}
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
