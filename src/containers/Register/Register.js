import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Spin, Icon, Checkbox } from 'antd';
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
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
  }

  onCancel() {
    this.props.history.replace('/app');
  }

  onCheckboxChange() {
    this.setState({ agreementsChecked: !this.state.agreementsChecked });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email } = values;
        this.setState({ submitting: true });

        const axiosOptions = axiosOptionsForNewCustomer();
        axios.post(
          `${config.hablaApiBaseUri}/users/registerUser/`,
          { email },
          axiosOptions)
          .then(() => {
            this.setState({ submitting: false, registered: true });
          });
      }
    });
  }

  renderRegistered() {
    if (this.state.submitting) {
      return <Spin size="large" style={{ width: '100%' }} />;
    }
    return (
      <div className="registration-success">
        <div><Icon type="check-circle-o" /></div>
        <h2 style={{ textAlign: 'center' }}>{String.t('register.successText')}</h2>
      </div>
    );
  }

  renderPreRegisteredButtons() {
    const buttonBackgroundColor = this.state.agreementsChecked ? '#00a854' : '#aac8a4';
    return (
      <FormItem>
        <div className="register-checkbox-div">
          <Checkbox
            checked={this.state.agreementsChecked}
            onChange={this.onCheckboxChange}
          >
            {String.t('register.checkAgreementsLabelBeforePrivacyPolicy')}
            <a
              onClick={() => window.open('https://habla.ai/privacy-policy.html')}
              className="register-link"
            >
              {String.t('register.checkAgreementsPrivacyPolicyLink')}
            </a>
            {String.t('register.checkAgreementsLabelBeforeTermsOfUse')}
            <a
              onClick={() => window.open('https://habla.ai/user-terms-of-service.html')}
              className="register-link"
            >
              {String.t('register.checkAgreementsTermsOfUseLink')}
            </a>
            {String.t('register.checkAgreementsLabelAfterTermsOfUse')}
          </Checkbox>
        </div>
        <Button type="primary" className="form-cancel-button" onClick={this.onCancel}>
          {String.t('cancelButton')}
        </Button>
        <Button
          disabled={!this.state.agreementsChecked}
          type="primary"
          htmlType="submit"
          className="form-action-button"
          style={{ backgroundColor: buttonBackgroundColor, borderColor: buttonBackgroundColor }}
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
      <div>
        <div className="register-title-div">
          <span className="register-title-bold">{String.t('register.titleBold')}
            <span className="register-title-normal">{String.t('register.titleDetails')}</span>
          </span>
        </div>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <EmailField
            form={this.props.form}
            layout={layout}
            placeholder={String.t('register.emailPlaceholder')}
            noLabel
            required
          />
          <div style={{ height: 10 }} />
          { this.renderPreRegisteredButtons() }
        </Form>
      </div>
    );
  }
}

Register.propTypes = propTypes;

export default Form.create()(Register);
