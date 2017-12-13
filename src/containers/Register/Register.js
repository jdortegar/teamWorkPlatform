import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Spin, Checkbox } from 'antd';
import axios from 'axios';
import { formShape } from '../../propTypes';
import config from '../../config/env';
import { axiosOptionsForNewCustomer } from '../../session';
import EmailField from '../../components/formFields/EmailField';
import './styles/style.css';
import String from '../../translations';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.object.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = { submitting: false, registered: false, agreementsChecked: false };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onResend = this.onResend.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onCancel() {
    this.props.history.replace('/app');
  }

  onChangeEmail() {
    this.setState({ registered: false });
  }

  onResend() {
    this.setState({ registered: false });
    this.doSubmit(this.state.email);
  }

  onCheckboxChange() {
    this.setState({ agreementsChecked: !this.state.agreementsChecked });
  }

  doSubmit(email) {
    this.setState({ submitting: true, email });

    const axiosOptions = axiosOptionsForNewCustomer();
    axios.post(
      `${config.hablaApiBaseUri}/users/registerUser/`,
      { email },
      axiosOptions
    ).then(() => {
      this.setState({ submitting: false, registered: true });
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.doSubmit(values.email);
      }
    });
  }

  renderRegistered() {
    if (this.state.submitting) {
      return <Spin size="large" style={{ width: '100%' }} />;
    }
    return (
      <div className="registration-success">
        <div className="register-title-div">
          <span className="register-title-bold">{String.t('register.successTitleBold')}
            <span className="register-title-normal">{String.t('register.successTitleDetails')}</span>
          </span>
        </div>
        <div className="register-success-email">
          {this.state.email}
        </div>
        <p className="register-success-details">
          {String.t('register.successTextLine1')}
          <br />
          {String.t('register.successTextLine2')}
        </p>
        <Button type="primary" className="form-cancel-button" onClick={this.onChangeEmail}>
          {String.t('register.changeEmailButton')}
        </Button>
        {/* <Button type="primary" className="form-action-button" onClick={this.onResend}>
          {String.t('register.resendButton')}
        </Button> */}
      </div>
    );
  }

  renderPreRegisteredButtons() {
    return (
      <FormItem>
        <div className="register-checkbox-div">
          <Checkbox
            checked={this.state.agreementsChecked}
            onChange={this.onCheckboxChange}
          />
          <p className="register-checkbox-text">
            {String.t('register.checkAgreementsLabelBeforePrivacyPolicy')}
            <a
              onClick={() => window.open('https://habla.ai/privacy-policy.html')}
              className="register-link"
            >
              <span className="register-link-body">
                {String.t('register.checkAgreementsPrivacyPolicyLink')}
              </span>
            </a>
            {String.t('register.checkAgreementsLabelBeforeTermsOfUse')}
            <a
              onClick={() => window.open('https://habla.ai/user-terms-of-service.html')}
              className="register-link"
            >
              {String.t('register.checkAgreementsTermsOfUseLink')}
            </a>
            {String.t('register.checkAgreementsLabelAfterTermsOfUse')}
          </p>
        </div>
        <Button type="primary" className="form-cancel-button" onClick={this.onCancel}>
          {String.t('cancelButton')}
        </Button>
        <Button
          disabled={!this.state.agreementsChecked}
          type="primary"
          htmlType="submit"
          className="form-action-button"
        >
          {String.t('register.registerButtonLabel')}
        </Button>
      </FormItem>
    );
  }

  render() {
    if (this.state.registered) {
      return this.renderRegistered();
    }

    return (
      <div className="register-body">
        <Form onSubmit={this.handleSubmit} layout="vertical" className="register-form">
          <div className="register-title-div">
            <span className="register-title-bold">{String.t('register.titleBold')}
              <span className="register-title-normal">{String.t('register.titleDetails')}</span>
            </span>
          </div>
          <div className="recoverPassword__field-wrapper">
            <EmailField
              form={this.props.form}
              layout={layout}
              placeholder={String.t('register.emailPlaceholder')}
              noLabel
              required
              componentKey="email"
            />
            <div style={{ height: 10 }} />
            { this.renderPreRegisteredButtons() }
          </div>
        </Form>
      </div>
    );
  }
}

Register.propTypes = propTypes;

export default Form.create()(Register);
