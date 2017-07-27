import React from 'react';
import { Form, Button, Row, Col } from 'antd';
import { formShape } from '../../propTypes';
import FirstNameField from '../../components/formFields/FirstNameField';
import LastNameField from '../../components/formFields/LastNameField';
import UsernameField from '../../components/formFields/UsernameField';
import EmailField from '../../components/formFields/EmailField';
import PasswordField from '../../components/formFields/PasswordField';
import ConfirmPasswordField from '../../components/formFields/ConfirmPasswordField';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired
};

const layout = {
  labelCol: { xs: 24 },
  wrapperCol: { xs: 24 }
};

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log(this.props);
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit} layout="vertical" style={{ marginTop: '30px' }}>
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
            />
          </Col>
          <Col className="gutter-row" span={12}>
            <EmailField
              form={this.props.form}
              layout={layout}
              disabled
              required
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <PasswordField
              form={this.props.form}
              layout={layout}
              required
            />
          </Col>
          <Col className="gutter-row" span={12}>
            <ConfirmPasswordField
              form={this.props.form}
              layout={layout}
              passwordComponentKey="password"
              required
            />
          </Col>
        </Row>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Create Account
          </Button>
        </FormItem>
      </Form>
    );
  }
}

CreateAccount.propTypes = propTypes;

export default Form.create()(CreateAccount);
