import React from 'react';
import { Form, Row, Col, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import countriesAndTimezones from 'countries-and-timezones';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { createAccount, loginUser } from 'src/actions';
import {
  Button,
  FirstNameField,
  LastNameField,
  UsernameField,
  EmailField,
  ConfirmPasswordField,
  CountrySelectField,
  TimezoneSelectField
} from 'src/components';

const FormItem = Form.Item;
const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const defaultCountry = countriesAndTimezones.getCountriesForTimezone(defaultTimeZone)[0] || '';

const propTypes = {
  form: formShape.isRequired,
  createAccount: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.handleCountryChange = this.handleCountryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    timeZone: defaultTimeZone,
    countryCode: defaultCountry && defaultCountry.id ? defaultCountry.id : '',
    loading: false,
    fieldProps: null
  };

  componentDidMount() {
    if (sessionStorage.getItem('habla-subscriberOrgName')) {
      this.setState({
        fieldProps: {
          disabled: 'disabled',
          initialValue: sessionStorage.getItem('habla-subscriberOrgName')
        }
      });
    }
  }

  handleCountryChange(countryCode) {
    this.setState({ countryCode });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const { email, password } = values;
        this.props
          .createAccount(values)
          .then(() => {
            this.setState({ loading: false });
            this.props.loginUser({ email: email.trim(), password, targetRoute: '/app' });
          })
          .catch(error => {
            this.setState({ loading: false });
            if (error.response && error.response.status === 403) {
              message.error(String.t('createAccount.errorEmailAlreadyRegistered'));
            } else {
              message.error(error.message);
            }
          });
      }
    });
  }

  render() {
    if (!sessionStorage.getItem('habla-user-email')) {
      this.props.history.replace('/app');
      return null;
    }

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical" className="profileForm">
        <div className="align-center-class padding-class-b">
          <span className="habla-big-title habla-bold-text">{String.t('register.completeProfileTitleBold')}</span>
          <br />
          <span className="habla-big-title">{String.t('register.completeProfileTitle')}</span>
        </div>
        <div className="habla-color-lightergrey padding-class-b">
          <div className="habla-full-content float-center-class">
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <FirstNameField form={this.props.form} layout={layout} required autoFocus />
              </Col>
              <Col className="gutter-row" span={12}>
                <LastNameField form={this.props.form} layout={layout} required />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <UsernameField
                  form={this.props.form}
                  layout={layout}
                  required
                  componentKey="displayName"
                  {...this.state.fieldProps}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <EmailField
                  form={this.props.form}
                  layout={layout}
                  disabled
                  required
                  initialValue={sessionStorage.getItem('habla-user-email')}
                />
              </Col>
            </Row>
            <ConfirmPasswordField layout={layout} componentKey="password" form={this.props.form} required />
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <CountrySelectField
                  form={this.props.form}
                  layout={layout}
                  required
                  handleChange={this.handleCountryChange}
                  initialValue={this.state.countryCode}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <TimezoneSelectField
                  form={this.props.form}
                  layout={layout}
                  countryCode={this.state.countryCode}
                  notFoundContent={String.t('Country.errNoText')}
                  initialValue={this.state.timeZone}
                  required
                />
              </Col>
            </Row>
          </div>
        </div>
        <FormItem>
          <div className="margin-top-class-a align-center-class">
            <Button loading={this.state.loading} type="main" htmlType="submit">
              {String.t('createAccount.createAccountButtonLabel')}
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createAccount: form => dispatch(createAccount(form)),
    loginUser: user => dispatch(loginUser(user))
  };
}

CreateAccount.propTypes = propTypes;

export default Form.create()(
  connect(
    null,
    mapDispatchToProps
  )(CreateAccount)
);
