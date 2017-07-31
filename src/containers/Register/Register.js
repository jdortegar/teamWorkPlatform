import React from 'react';
import { Form, Button, Spin, Icon } from 'antd';
import axios from 'axios';
import { formShape } from '../../propTypes';
import config from '../../config/env';
import EmailField from '../../components/formFields/EmailField';
import './styles/style.css';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = { submitting: false, registered: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { email } = values;
        this.setState({ submitting: true });
        axios.post(
          `${config.hablaApiBaseUri}/users/registerUser/`,
          { email })
        .then(() => {
          this.setState({ submitting: false, registered: true });
        });
      }
    });
  }

  renderButton() {
    if (!this.state.submitting && this.state.registered) {
      return (
        <div className="registration-success">
          <div><Icon type="check-circle-o" /></div>
          <h2 style={{ textAlign: 'center' }}>Thank you for joining Habla AI! To finish signing up, please check your email to verify your account.</h2>
        </div>
      );
    } else if (this.state.submitting) {
      return <Spin size="large" style={{ width: '100%' }} />;
    }

    return (
      <FormItem>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Register
        </Button>
      </FormItem>
    );
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <EmailField
          form={this.props.form}
          layout={layout}
          required
        />
        { this.renderButton() }
      </Form>
    );
  }
}

Register.propTypes = propTypes;

export default Form.create()(Register);
