import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'antd';
import { Link } from 'react-router-dom';
import { formShape } from '../../propTypes';
import { hablaBlackLogo } from '../../img';
import ConfirmPasswordField from '../../components/formFields/ConfirmPasswordField';
import String from '../../translations';
import './styles/style.css';

const propTypes = {
  form: formShape.isRequired,
  history: PropTypes.object.isRequired
};

class SetNewPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      sentEmail: false
    };

    this.onCancel = this.onCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onCancel() {
    this.props.history.replace('/login');
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          email: values.email,
          emailSent: true
        });
      }
    });
  }

  render() {
    return (
      <div className="recoverPassword-main-container">
        <div className="recoverPassword-header">
          <Link to="/app">
            <img src={hablaBlackLogo} alt={String.t('Header.logoAlt')} className="logo" />
          </Link>
        </div>
        <div className="recoverPassword-body">
          <Form onSubmit={this.handleSubmit} layout="vertical" className="recoverPassword-form">
            <h1>Hello Thomas!</h1>
            <h2>{String.t('chooseNewPassword')}</h2>

            <div className="recoverPassword-body__main">
              <div className="SetNewPassword__field-wrapper">
                <ConfirmPasswordField
                  componentKey="password"
                  form={this.props.form}
                  placeholder={String.t('newPasswordPlaceholder')}
                  noLabel
                  required
                />
              </div>
            </div>

            <div className="recoverPassword__buttons">
              <Button type="primary" htmlType="submit" onClick={this.onCancel} className="recoverPassword__login-form-button disable">
                {String.t('Buttons.cancel')}
              </Button>
              <Button type="primary" htmlType="submit" className="recoverPassword__login-form-button active">
                {String.t('Buttons.next')}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

SetNewPassword.propTypes = propTypes;

export default Form.create()(SetNewPassword);
