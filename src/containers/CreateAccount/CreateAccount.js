import React from 'react';
import { Form, Row, Col, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import countriesAndTimezones from 'countries-and-timezones';

import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { extractQueryParams } from 'src/routes';
import { createAccount, verifyConfirmationCode } from 'src/actions';
import {
  Button,
  FirstNameField,
  LastNameField,
  UsernameField,
  EmailField,
  PasswordField,
  ConfirmationCodeField,
  CountrySelectField,
  TimezoneSelectField
} from 'src/components';

const FormItem = Form.Item;
const defaultTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const defaultCountry = countriesAndTimezones.getCountriesForTimezone(defaultTimeZone)[0] || '';

const propTypes = {
  form: formShape.isRequired,
  createAccount: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class CreateAccount extends React.Component {
  state = {
    verified: false,
    verifiedEmail: '',
    verifiedOrgName: '',
    timeZone: defaultTimeZone,
    countryCode: defaultCountry && defaultCountry.id ? defaultCountry.id : '',
    loading: false,
    fieldProps: null
  };

  validateCode = (rule, value, callback) => {
    const { rid } = extractQueryParams(this.props);
    this.props.verifyConfirmationCode(value, rid).then(
      ({ email, orgName }) => {
        this.setState({ verified: true, verifiedEmail: email, verifiedOrgName: orgName });
        callback();
      },
      error => callback(String.t(`createAccount.${error}`))
    );
  };

  handleCountryChange = countryCode => {
    this.setState({ countryCode });
  };

  handleSubmit = e => {
    e.preventDefault();
    const fields = ['country', 'displayName', 'email', 'firstName', 'lastName', 'password', 'timeZone'];
    this.props.form.validateFields(fields, (err, values) => {
      if (!err) {
        this.setState({ loading: true });
        this.props
          .createAccount(values)
          .then(() => this.setState({ loading: false }))
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
  };

  render() {
    const { form } = this.props;
    const { verified, verifiedEmail, verifiedOrgName, timeZone, countryCode, loading, fieldProps } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical" className="profileForm">
        <div className="align-center-class padding-class-b profileTitle">
          <h2 className="habla-bold-text habla-big-title">{String.t('register.completeProfileTitleBold')}</h2>
          <span className="habla-big-title">{String.t('register.completeProfileTitle')}</span>
        </div>
        <div className="habla-color-lightergrey padding-class-b">
          <div className="habla-full-content float-center-class">
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <ConfirmationCodeField
                  form={form}
                  layout={layout}
                  onChange={this.handleConfirmationCodeChange}
                  disabled={verified}
                  validator={this.validateCode}
                  required
                  autoFocus
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <PasswordField form={form} layout={layout} disabled={!verified} required />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <FirstNameField form={form} layout={layout} disabled={!verified} required />
              </Col>
              <Col className="gutter-row" span={12}>
                <LastNameField form={form} layout={layout} disabled={!verified} required />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <UsernameField
                  componentKey="displayName"
                  form={form}
                  layout={layout}
                  disabled={!verified || verifiedOrgName}
                  initialValue={verifiedOrgName}
                  required
                  {...fieldProps}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <EmailField form={form} layout={layout} initialValue={verifiedEmail} disabled required />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={12}>
                <CountrySelectField
                  form={form}
                  layout={layout}
                  handleChange={this.handleCountryChange}
                  initialValue={countryCode}
                  disabled={!verified}
                  required
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <TimezoneSelectField
                  form={form}
                  layout={layout}
                  countryCode={countryCode}
                  notFoundContent={String.t('Country.errNoText')}
                  initialValue={timeZone}
                  disabled={!verified}
                  required
                />
              </Col>
            </Row>
          </div>
        </div>
        <FormItem>
          <div className="margin-top-class-a align-center-class">
            <Button loading={loading} type="primary" htmlType="submit" size="large" disabled={!verified}>
              {String.t('createAccount.createAccountButtonLabel')}
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}

CreateAccount.propTypes = propTypes;

export default Form.create()(
  connect(
    null,
    { createAccount, verifyConfirmationCode }
  )(CreateAccount)
);
