import React from 'react';
import PropTypes from 'prop-types';
import { Form, Spin, Checkbox } from 'antd';
import axios from 'axios';

import { buildApiUrl } from 'src/lib/api';
import String from 'src/translations';
import { formShape } from 'src/propTypes';
import { getAwsHeaders } from 'src/actions';
import { paths, extractQueryParams } from 'src/routes';
import { Button, EmailField } from 'src/components';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.object.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

const validateCheckbox = (rule, value, callback) => {
  if (!value) {
    callback(String.t('register.acceptTermsOfService'));
  }

  callback();
};

class Register extends React.Component {
  constructor(props) {
    super(props);

    const { awsCustomerId } = extractQueryParams(props);
    if (awsCustomerId) {
      props.history.replace(paths.register);
    }
    this.state = {
      submitting: false,
      registered: false,
      awsCustomerId
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onResend = this.onResend.bind(this);
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

  doSubmit(email) {
    this.setState({ submitting: true, email });
    const { awsCustomerId } = this.state;

    axios.post(buildApiUrl('users/registerUser'), { email }, getAwsHeaders(awsCustomerId)).then(() => {
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
      <div className="registration-success align-center-class">
        <div className="register-title-div padding-class-b">
          <span className="habla-big-title habla-bold-text">
            {String.t('register.successTitleBold')}
            <span className="habla-big-title">{String.t('register.successTitleDetails')}</span>
          </span>
        </div>
        <div className="habla-color-lightergrey padding-class-b">
          <div className="habla-big-title habla-bold-text">
            <i className="fa fa-envelope" aria-hidden="true" /> {this.state.email}
          </div>
          <p className="margin-top-class-a">
            {String.t('register.successTextLine1')}
            <br />
            {String.t('register.successTextLine2')}
          </p>
        </div>
        <div className="margin-top-class-a">
          <Button type="main" fitText onClick={this.onChangeEmail}>
            {String.t('register.changeEmailButton')}
          </Button>
        </div>
      </div>
    );
  }

  renderPreRegisteredButtons() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="register-checkbox-div">
        <FormItem className="no-margin">
          {getFieldDecorator('agreement', {
            valuePropName: 'checked',
            rules: [
              {
                required: true,
                message: String.t('register.acceptTermsOfService')
              },
              {
                validator: validateCheckbox
              }
            ]
          })(<Checkbox tabIndex={0} />)}
          <p>
            {String.t('register.checkAgreementsLabelBeforePrivacyPolicy')}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://habla.ai/privacy-policy.html"
              className="register-link"
            >
              <span className="register-link-body">{String.t('register.checkAgreementsPrivacyPolicyLink')}</span>
            </a>
            {String.t('register.checkAgreementsLabelBeforeTermsOfUse')}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://habla.ai/user-terms-of-service.html"
              className="register-link"
            >
              {String.t('register.checkAgreementsTermsOfUseLink')}
            </a>
            {String.t('register.checkAgreementsLabelAfterTermsOfUse')}
          </p>
        </FormItem>
      </div>
    );
  }

  render() {
    if (this.state.registered) {
      return this.renderRegistered();
    }

    return (
      <div className="register-body">
        <Form onSubmit={this.handleSubmit} layout="vertical" className="register-form">
          <div className="register-title-div align-center-class padding-class-b">
            <span className="habla-big-title habla-bold-text">
              {String.t('register.titleBold')}
              <span className="habla-big-title">{String.t('register.titleDetails')}</span>
            </span>
          </div>
          <div className="habla-color-lightergrey padding-class-b">
            <div className="habla-full-content float-center-class">
              <EmailField
                form={this.props.form}
                layout={layout}
                placeholder={String.t('register.emailPlaceholder')}
                noLabel
                required
                componentKey="email"
                initialValue={sessionStorage.getItem('habla-user-email')}
                autoFocus
              />
              {this.renderPreRegisteredButtons()}
            </div>
          </div>
          <div className="align-center-class margin-top-class-a">
            <Button type="secondary" fitText onClick={this.onCancel} className="margin-right-class-a">
              {String.t('cancelButton')}
            </Button>
            <Button type="main" fitText htmlType="submit" loading={this.state.submitting}>
              {String.t('register.registerButtonLabel')}
            </Button>
          </div>
        </Form>
      </div>
    );
  }
}

Register.propTypes = propTypes;

export default Form.create()(Register);
