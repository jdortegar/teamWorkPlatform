import React from 'react';
import { Form, Button, Row, Col, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import countriesAndTimezones from 'countries-and-timezones';
import { formShape } from '../../propTypes';
import FirstNameField from '../../components/formFields/FirstNameField';
import LastNameField from '../../components/formFields/LastNameField';
import UsernameField from '../../components/formFields/UsernameField';
import EmailField from '../../components/formFields/EmailField';
import ConfirmPasswordField from '../../components/formFields/ConfirmPasswordField';
import CountrySelectField from '../../components/formFields/CountrySelectField';
import TimezoneSelectField from '../../components/formFields/TimezoneSelectField';
import { createAccount, loginUser } from '../../actions';
import String from '../../translations';

const FormItem = Form.Item;
const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const defaultCountry = countriesAndTimezones.getCountriesForTimezone(defaultTimeZone)[0];

const propTypes = {
  form: formShape.isRequired,
  createAccount: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired
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
    countryCode: (defaultCountry && defaultCountry.id) ? defaultCountry.id : null,
    loading: false
  };

  handleCountryChange(countryCode) {
    this.setState({ countryCode });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        const { email, password } = values;
        this.props.createAccount(values).then(() => {
          this.setState({ loading: false });
          this.props.loginUser({ email, password, targetRoute: '/app' });
        }).catch(() => {
          // email already registered
          message.error('The user is already registered.');
          this.setState({ loading: false });
        });
      }
    });
  }

  render() {
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
                <FirstNameField
                  form={this.props.form}
                  layout={layout}
                  required
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <LastNameField
                  form={this.props.form}
                  layout={layout}
                  required
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <UsernameField
                  form={this.props.form}
                  layout={layout}
                  required
                  componentKey="displayName"
                  initialValue={sessionStorage.getItem('habla-user-email')}
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
            <ConfirmPasswordField
              layout={layout}
              componentKey="password"
              form={this.props.form}
              required
            />
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
            <Button loading={this.state.loading} type="primary" htmlType="submit" className="habla-button habla-button-main habla-color-green">
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

export default Form.create()(connect(null, mapDispatchToProps)(CreateAccount));
