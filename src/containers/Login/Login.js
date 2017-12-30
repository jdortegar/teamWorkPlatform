import React from 'react';
import { Row, Col, Form, Button, Checkbox, Spin, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { setAwsCustomerId } from '../../session';
import { routesPaths, extractQueryParams } from '../../routes';
import { formShape } from '../../propTypes';
import EmailField from '../../components/formFields/EmailField';
import PasswordField from '../../components/formFields/PasswordField';
import { loginUser } from '../../actions';
import './styles/login.css';
import String from '../../translations';
import { hablaWhiteLogo } from '../../img';
import LoginPageBackground from '../../img/ai-hand-shake-back.jpg';


const loginpage = {
  backgroundImage: `url(${LoginPageBackground})`
};

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  loginUser: PropTypes.func.isRequired,
  loggingIn: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired
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
      props.history.replace(routesPaths.login);
    }

    this.state = {
      submited: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onForgotPassword = this.onForgotPassword.bind(this);
  }

  onForgotPassword() {
    this.props.history.push('/recoverPassword');
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email, password } = values;
        let targetRoute = routesPaths.app;
        if (this.props.history.location.state) { // Send user directly to requested URL, or app if cannot be deduced.
          const { state } = this.props.history.location;
          targetRoute = state.from.pathname;
          if (state.from.search) {
            targetRoute += state.from.search;
          }
        }

        this.props.loginUser({ email, password, targetRoute });
        this.setState({
          submited: true
        });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    if (this.state.submited && this.props.error) {
      message.error(String.t('errLoginPasswordInvalid'));
      this.props.form.resetFields(['password']);
      this.setState({
        submited: false
      });
    }

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
                  noLabel
                />
                <PasswordField
                  form={this.props.form}
                  layout={layout}
                  required
                  placeholder={String.t('register.passwordPlaceholder')}
                  noLabel
                  validatePassword={false}
                />
                <FormItem>
                  {
                    this.props.loggingIn ?
                      <Spin size="large" style={{ width: '100%' }} /> :
                      <Button type="primary" htmlType="submit" className="habla-button habla-button-main login-form-button habla-color-green">
                        {String.t('login.loginButtonLabel')}
                      </Button>
                  }
                  <div className="login-main-options">
                    {getFieldDecorator('remember', {
                      valuePropName: 'checked',
                      initialValue: false
                    })(
                      <Checkbox>{String.t('login.rememberMeCheckboxLabel')}</Checkbox>
                    )}
                    <a className="login-form-forgot" onClick={this.onForgotPassword}>{String.t('login.forgotPasswordLabel')}</a>
                  </div>
                  <div className="login-main-signup">
                    <Link to="/register">{String.t('login.signUpLabel')}
                    </Link>
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

const mapStateToProps = (state) => {
  return {
    loggingIn: state.auth.loggingIn,
    error: state.auth.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ loginUser }, dispatch);
};

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Login));
