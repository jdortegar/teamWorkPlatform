import React, { Component } from 'react';
import PropTypes from 'prop-types';
import countriesAndTimezones from 'countries-and-timezones';
import classNames from 'classnames';
import { Collapse, Form, Tooltip, message } from 'antd';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import {
  Button,
  FirstNameField,
  LastNameField,
  EmailField,
  CountrySelectField,
  TimezoneSelectField,
  UploadImageField,
  SwitchField,
  PageHeader
} from 'src/components';
import './styles/style.css';

const { Panel } = Collapse;

const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const defaultCountry = countriesAndTimezones.getCountriesForTimezone(defaultTimeZone)[0];

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired
};

class EditUserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countryCode: defaultCountry && defaultCountry.id ? defaultCountry.id : null,
      loading: false,
      userIcon: null
    };

    this.onChangeProfilePhoto = this.onChangeProfilePhoto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  onRemoveImage() {
    this.setState({ userIcon: null });
  }

  onChangeProfilePhoto(base64) {
    this.setState({ userIcon: base64 });
  }

  handleCountryChange(countryCode) {
    this.setState({ countryCode });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const { user } = this.props;
        const { preferences = {} } = user;
        const dataToUpdate = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          timeZone: values.timeZone,
          country: values.country,
          email: values.email.trim(),
          icon: this.state.userIcon,
          preferences: { ...preferences, smartChat: values.smartChat }
        };
        this.props
          .updateUser(dataToUpdate, user.userId)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.goBack();
            message.success(String.t('editUserPage.userUpdated'));
          })
          .catch(error => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  }

  render() {
    const { user } = this.props;
    const { preferences = {} } = user;
    const containerImage = classNames({
      container__image: true,
      'with-image': this.state.userIcon,
      'with-no-image': !this.state.userIcon
    });

    // Breadcrumb
    const pageBreadCrumb = {
      routes: [
        {
          title: String.t('editUserPage.title')
        }
      ]
    };

    return (
      <div className="userAccountSetting">
        <PageHeader pageBreadCrumb={pageBreadCrumb} backButton settingsIcon />
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Collapse defaultActiveKey={['1']} className="edituser_collapse">
            <Panel header={String.t('editUserPage.profileSettings')} key="1" className="ant-collapse-header">
              <div className="collapse-content">
                <div className="row_input">
                  <div className="input-item input-firstname left">
                    <FirstNameField form={this.props.form} required initialValue={user.firstName} />
                  </div>
                  <div className="input-item input-lastname">
                    <LastNameField form={this.props.form} required initialValue={user.lastName} />
                  </div>
                </div>
                <div className="row_input">
                  <div className="input-item">
                    <EmailField form={this.props.form} disabled required initialValue={user.email} />
                  </div>
                  <div className={containerImage}>
                    <UploadImageField
                      text={String.t('editUserPage.setProfilePhoto')}
                      onChange={this.onChangeProfilePhoto}
                      image={this.state.userIcon || this.state.logo || user.icon}
                      editOrg
                      resize
                    />
                    {this.state.userIcon && (
                      <span className="container__image__remove" onClick={this.onRemoveImage}>
                        {String.t('editUserPage.removeImageLabel')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="row_input">
                  <div className="input-item left">
                    <CountrySelectField
                      form={this.props.form}
                      required
                      handleChange={this.handleCountryChange}
                      initialValue={user.country}
                    />
                  </div>
                  <div className="input-item">
                    <TimezoneSelectField
                      form={this.props.form}
                      countryCode={this.state.countryCode}
                      notFoundContent="Please select a country"
                      initialValue={user.timeZone}
                      required
                    />
                  </div>
                </div>
                <div className="row_input">
                  <div className="input-item">
                    <Tooltip placement="top" title={String.t('editUserPage.smartChat')}>
                      <SwitchField
                        checkedChildren={String.t('on')}
                        unCheckedChildren={String.t('off')}
                        form={this.props.form}
                        componentKey="smartChat"
                        initialValue={preferences.smartChat === undefined ? true : preferences.smartChat}
                        valuePropName="checked"
                      />
                    </Tooltip>
                    <div className="New-team__title margin-left-class-a habla-secon">
                      {String.t('editUserPage.smartChat')}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>
          <div className="edit-org__buttons margin-top-class-b">
            <Button
              type="secondary"
              fitText
              className="margin-right-class-a"
              onClick={() => this.props.history.goBack()}
            >
              {String.t('Buttons.cancel')}
            </Button>
            <Button type="main" fitText onClick={this.handleSubmit} loading={this.state.loading}>
              {String.t('editUserPage.saveButtonLabel')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

EditUserPage.propTypes = propTypes;

export default Form.create()(EditUserPage);
