import React from 'react';
import { Form, Button } from 'antd';
import { formShape } from '../../propTypes';
import EmailField from '../../components/formFields/EmailField';

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

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <EmailField
          form={this.props.form}
          layout={layout}
          required
        />
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

Register.propTypes = propTypes;

export default Form.create()(Register);
