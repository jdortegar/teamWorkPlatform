import React from 'react';
import { Form, Button, Checkbox, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { routesPaths } from '../../routes';
import { formShape } from '../../propTypes';
import EmailField from '../../components/formFields/EmailField';
import PasswordField from '../../components/formFields/PasswordField';
import { loginUser } from '../../actions';
import './styles/login.css';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  loginUser: PropTypes.func.isRequired,
  loggingIn: PropTypes.bool.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.props.form.getFieldsValue();
    let targetRoute = routesPaths.app;
    const XXX = this.props;
    if (this.props.history.location.state) { // Send user directly to requested URL, or app if cannot be deduced.
      const { state } = this.props.history.location;
      targetRoute = state.from.pathname;
      if (state.from.search) {
        targetRoute += state.from.search;
      }
    }

    this.props.loginUser({ email, password, targetRoute });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <EmailField
          form={this.props.form}
          layout={layout}
          required
        />
        <PasswordField
          form={this.props.form}
          layout={layout}
          required
          validatePassword={false}
        />
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: false
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password</a>
          {
            this.props.loggingIn ?
              <Spin size="large" style={{ width: '100%' }} /> :
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
          }
          Or <Link to="/register">register now!</Link>
        </FormItem>
      </Form>
    );
  }
}

Login.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    loggingIn: state.auth.loggingIn
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginUser }, dispatch);
}

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(Login));
