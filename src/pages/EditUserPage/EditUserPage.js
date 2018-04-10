import React, { Component } from 'react';
import PropTypes from 'prop-types';
import countriesAndTimezones from 'countries-and-timezones';
import classNames from 'classnames';
import { Collapse, Form, message } from 'antd';
import Button from '../../components/common/Button';
import String from '../../translations';
import { formShape } from '../../propTypes';
import {
  FirstNameField,
  LastNameField,
  UsernameField,
  EmailField,
  CountrySelectField,
  TimezoneSelectField,
  UploadImageField,
  NewSubpageHeader
} from '../../components';
import './styles/style.css';

const Panel = Collapse.Panel;

const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const defaultCountry = countriesAndTimezones.getCountriesForTimezone(defaultTimeZone)[0];

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired
};

class EditUserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeZone: defaultTimeZone,
      countryCode: (defaultCountry && defaultCountry.id) ? defaultCountry.id : null,
      loading: false,
      userIcon: props.user.icon || null
    };

    this.onChangeProfilePhoto = this.onChangeProfilePhoto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.onRemoveImage = this.onRemoveImage.bind(this);
  }

  onRemoveImage() {
    this.setState({
      userIcon: null
    });
  }

  onChangeProfilePhoto(base64) {
    this.setState({
      userIcon: base64
    });
  }

  handleCountryChange(countryCode) {
    this.setState({ countryCode });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const dataToUpdate = {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          timeZone: values.timeZone,
          country: values.country,
          email: values.email.trim(),
          displayName: values.username.trim(),
          icon: this.state.userIcon
        };
        this.props.updateUser(dataToUpdate)
          .then(() => {
            this.setState({ loading: false });
            message.success(String.t('editUserPage.userUpdated'));
          })
          .catch((error) => {
            this.setState({ loading: false });
            message.error(error.message);
          });
      }
    });
  }

  render() {
    const { user } = this.props;
    const containerImage = classNames({
      container__image: true,
      'with-image': this.state.userIcon,
      'with-no-image': !this.state.userIcon
    });
    return (
      <div className="userAccountSetting">
        <NewSubpageHeader>
          <div className="habla-title"><i className="fas fa-address-card" /> {String.t('editUserPage.title')}</div>
        </NewSubpageHeader>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Collapse defaultActiveKey={['1']} className="edituser_collapse">
            <Panel header={String.t('editUserPage.profileSettings')} key="1" className="ant-collapse-header">
              <div className="collapse-content">
                <div className="row_input">
                  <div className="input-item input-firstname left">
                    <FirstNameField
                      form={this.props.form}
                      required
                      initialValue={user.firstName}
                    />
                  </div>
                  <div className="input-item input-lastname">
                    <LastNameField
                      form={this.props.form}
                      required
                      initialValue={user.lastName}
                    />
                  </div>
                </div>
                <div className="row_input">
                  <div className="input-item">
                    <EmailField
                      form={this.props.form}
                      disabled
                      required
                      initialValue={user.email}
                    />
                  </div>
                </div>
                <div className="row_input">
                  <div className="input-item">
                    <UsernameField
                      form={this.props.form}
                      required
                      initialValue={user.displayName}
                    />
                  </div>
                  <div className={containerImage}>
                    <UploadImageField
                      text={String.t('editUserPage.setProfilePhoto')}
                      onChange={this.onChangeProfilePhoto}
                      image={this.state.userIcon || this.state.logo}
                      editOrg
                      resize
                    />
                    {this.state.userIcon &&
                      <span
                        className="container__image__remove"
                        onClick={this.onRemoveImage}
                      >
                        {String.t('editUserPage.removeImageLabel')}
                      </span>
                    }
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
              </div>
            </Panel>
          </Collapse>
          <div className="edit-org__buttons border-top-lighter margin-top-class-b">
            <Button
              type="secondary"
              fitText
              className="margin-right-class-a"
              onClick={() => this.props.history.push('/app')}
            >
              {String.t('Buttons.cancel')}
            </Button>
            <Button
              type="main"
              fitText
              onClick={this.handleSubmit}
              loading={this.state.loading}
            >
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
