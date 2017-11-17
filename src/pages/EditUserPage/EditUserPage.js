import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import countriesAndTimezones from 'countries-and-timezones';
import { Collapse, Form, Button, notification } from 'antd';
import messages from './messages';
import { formShape } from '../../propTypes';
import { getJwt } from '../../session';
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
import config from '../../config/env';
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
  sideBarIsHidden: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  toggleSideBar: PropTypes.func.isRequired
};

class EditUserPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeZone: defaultTimeZone,
      countryCode: (defaultCountry && defaultCountry.id) ? defaultCountry.id : null,
      loading: false,
      avatarBase64: props.user.preferences.avatarBase64 || ''
    };

    this.onChangeProfilePhoto = this.onChangeProfilePhoto.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCountryChange = this.handleCountryChange.bind(this);
  }

  componentDidMount() {
    if (!this.props.sideBarIsHidden) {
      this.props.toggleSideBar();
    }
  }

  componentWillUnmount() {
    this.props.toggleSideBar();
  }

  onChangeProfilePhoto(base64) {
    const { userId } = this.props.user;
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
    axios.patch(`${config.hablaApiBaseUri}/users/updatePublicPreferences/${userId}`, dataToUpdate, axiosOptions)
      .then(() => {
        this.setState({
          avatarBase64: base64
        });
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
        this.props.updateUser(values)
          .then(() => {
            this.setState({ loading: false });
            this.props.history.push('/app');
            notification.open({
              message: messages.success,
              description: messages.userUpdated,
              duration: 4
            });
          });
      }
    });
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <NewSubpageHeader>
          <div className="subpage__header__title">{messages.title}</div>
        </NewSubpageHeader>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Collapse defaultActiveKey={['1']} className="edituser_collapse">
            <Panel header={messages.profileSettings} key="1" className="edituser_panel">
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
                <div className="container__image">
                  <UploadImageField
                    text={messages.setProfilePhoto}
                    onChange={this.onChangeProfilePhoto}
                    editOrg
                    image={this.state.avatarBase64 || this.state.logo}
                  />
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
            </Panel>
            <Panel header="Messaging and Notifications" key="2" className="edituser_panel">
              <p>3284238432849832</p>
            </Panel>
          </Collapse>

          <div className="edit-org__buttons">
            <Button
              type="primary"
              className="Edit-team__button New-team__button--margin-right"
              onClick={() => this.props.history.push('/app')}
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
    );
  }
}

EditUserPage.propTypes = propTypes;

export default Form.create()(EditUserPage);
