import React from 'react';
import { Row, Col, Form, Checkbox, Spin, message } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { isLoggingIn, getAuthError } from 'selectors';
import { setAwsCustomerId } from '../../session';
import { paths, extractQueryParams } from '../../routes';
import { formShape } from '../../propTypes';
import EmailField from '../../components/formFields/EmailField';
import PasswordField from '../../components/formFields/PasswordField';
import { loginUser } from '../../actions';
import String from '../../translations';
import { hablaWhiteLogo } from '../../img';
import LoginPageBackground from '../../img/ai-hand-shake-back.jpg';
import Button from '../../components/common/Button';
import './styles/login.css';

const loginpage = {
  backgroundImage: `url(${LoginPageBackground})`
};

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  loginUser: PropTypes.func.isRequired,
  loggingIn: PropTypes.bool.isRequired,
  error: PropTypes.object,
  history: PropTypes.object.isRequired
};

const defaultProps = {
  error: null
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    const { awsCustomerId } = extractQueryParams(props);
    if (awsCustomerId) {
      setAwsCustomerId(awsCustomerId);
      props.history.replace(paths.login);
    }

    this.state = {
      submitted: false,
      awsCustomerId
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onForgotPassword = this.onForgotPassword.bind(this);
    this.onNewUserSignUp = this.onNewUserSignUp.bind(this);
  }

  onForgotPassword() {
    sessionStorage.setItem('habla-user-email', this.props.form.getFieldValue('email') || '');
    this.props.history.push('/recoverPassword');
  }

  onNewUserSignUp() {
    sessionStorage.setItem('habla-user-email', this.props.form.getFieldValue('email') || '');
    this.props.history.push('/register');
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password } = values;
        let targetRoute = paths.app;
        if (this.props.history.location.state) { // Send user directly to requested URL, or app if cannot be deduced.
          const { state } = this.props.history.location;
          targetRoute = state.from.pathname;
          if (state.from.search) {
            targetRoute += state.from.search;
          }
        }

        const rememberMe = this.props.form.getFieldValue('remember');
        const rememberMeEmail = rememberMe ? email : '';
        sessionStorage.setItem('habla-user-remember-me', rememberMeEmail);

        const { awsCustomerId } = this.state;
        this.props.loginUser({ email, password, targetRoute, awsCustomerId });
        this.setState({ submitted: true });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    if (this.state.submitted && this.props.error) {
      message.error(String.t('errLoginPasswordInvalid'));
      this.props.form.resetFields(['password']);
      this.setState({
        submitted: false
      });
    }
    const initialEmail = sessionStorage.getItem('habla-user-remember-me');
    const rememberMe = initialEmail && initialEmail.length;
    return (
      <div className="login-main-div" style={loginpage}>
        <Row type="flex" justify="center" align="middle">
          <Col xs={{ span: 20 }} md={{ span: 12 }} lg={{ span: 8 }}>
            <div className="login-main-container">
              <div className="login-main-div-logo">
                <img src={hablaWhiteLogo} alt={String.t('Header.logoAlt')} className="img" />
              </div>
              <Form onSubmit={this.handleSubmit} layout="vertical">
                <EmailField
                  form={this.props.form}
                  layout={layout}
                  required
                  placeholder={String.t('register.emailPlaceholder')}
                  initialValue={initialEmail}
                  noLabel
                  autoFocus={!initialEmail || !initialEmail.length}
                />
                <PasswordField
                  form={this.props.form}
                  layout={layout}
                  required
                  placeholder={String.t('register.passwordPlaceholder')}
                  noLabel
                  validatePassword={false}
                  autoFocus={initialEmail && initialEmail.length}
                />
                <FormItem>
                  {
                    this.props.loggingIn ?
                      <Spin size="large" style={{ width: '100%' }} /> :
                      <Button className="ButtonFull" type="main" fitText htmlType="submit">{String.t('Buttons.login')}</Button>
                  }
                  <div className="login-main-options">
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: rememberMe
                    })(
                      <Checkbox>{String.t('login.rememberMeCheckboxLabel')}</Checkbox>
                    )}
                    <a className="login-form-forgot" onClick={this.onForgotPassword}>{String.t('login.forgotPasswordLabel')}</a>
                  </div>
                  <div className="login-main-signup">
                    <a onClick={this.onNewUserSignUp}><span className="habla-bold-text">{String.t('login.newUserLabel')}</span> {String.t('login.signUpLabel')}</a>
                  </div>
                </FormItem>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

const mapStateToProps = state => ({
  loggingIn: isLoggingIn(state),
  error: getAuthError(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({ loginUser }, dispatch);

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Login));
