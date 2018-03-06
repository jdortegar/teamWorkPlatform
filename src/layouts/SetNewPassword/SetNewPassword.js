import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Spin, message } from 'antd';
import { formShape } from '../../propTypes';
import ConfirmPasswordField from '../../components/formFields/ConfirmPasswordField';
import String from '../../translations';
import Button from '../../components/common/Button';
import './styles/style.css';

const propTypes = {
  setNewPassword: PropTypes.func.isRequired,
  form: formShape.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      uuid: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

class SetNewPassword extends Component {
  constructor(props) {
    super(props);

    this.state = { processing: false };
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
        this.setState({ processing: true });
        const uuid = this.props.match.params.uuid;
        this.props.setNewPassword(uuid, values.password)
          .then(() => {
            this.setState({ processing: false });
            this.props.history.replace('/login');
            message.success(String.t('setNewPassword.passwordChangedToastMessage'));
          })
          .catch((error) => {
            this.setState({ processing: false });
            if (error.response.status === 404) {
              message.error(String.t('setNewPassword.errorToastMessage'));
              this.props.history.replace('/recoverPassword');
            } else {
              message.error(error.message);
            }
          });
      }
    });
  }

  render() {
    return (
      <div className="recoverPassword-main-container">
        <div className="recoverPassword-body">
          <Form
            onSubmit={this.handleSubmit}
            layout="vertical"
            className="setNewPassword-form"
          >
            <div className="habla-big-title habla-bold-text align-center-class padding-class-b">{String.t('chooseNewPassword')}</div>
            <div className="recoverPassword-body__main habla-color-lightergrey padding-class-b align-center-class">
              <div className="habla-full-content float-center-class">
                <div className="margin-top-class-a">
                  <ConfirmPasswordField
                    componentKey="password"
                    vertical
                    form={this.props.form}
                    passwordPlaceholder={String.t('setNewPassword.newPasswordPlaceholder')}
                    placeholder={String.t('setNewPassword.confirmNewPasswordPlaceholder')}
                    noLabel
                    required
                  />
                </div>
              </div>

              <div className="align-center-class margin-top-class-a">
                <Button
                  disabled={this.state.processing}
                  type="secondary"
                  fitText
                  onClick={this.onCancel}
                  className="margin-right-class-a"
                >
                  {String.t('Buttons.cancel')}
                </Button>
                <Button
                  disabled={this.state.processing}
                  type="main"
                  fitText
                  htmlType="submit"
                >
                  {
                    this.state.processing ?
                      <Spin size="large" />
                      :
                      String.t('setNewPassword.submitLabel')
                  }
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

SetNewPassword.propTypes = propTypes;

export default SetNewPassword;
