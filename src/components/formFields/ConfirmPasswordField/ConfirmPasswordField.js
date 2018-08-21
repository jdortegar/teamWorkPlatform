/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row } from 'antd';
import { antValidate, equality, password } from '../../../validations';
import { formShape, layoutShape } from '../../../propTypes';
import BaseInput from '../BaseInput';
import String from '../../../translations';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  passwordPlaceholder: PropTypes.string,
  layout: layoutShape,
  required: PropTypes.bool,
  missingMessage: PropTypes.string,
  vertical: PropTypes.bool,
  noLabel: PropTypes.bool
};

const defaultProps = {
  componentKey: 'passwordConfirm',
  initialValue: null,
  placeholder: null,
  passwordPlaceholder: null,
  required: true,
  missingMessage: String.t('errPasswordMissing'),
  layout: {},
  vertical: false,
  noLabel: false
};

class ConfirmPasswordField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      isPopoverVisible: false
    };

    this.showPopover = this.updateStateWith({ isPopoverVisible: true });
    this.hidePopover = this.updateStateWith({ isPopoverVisible: false });
    this.updatePassword = this.updatePassword.bind(this);
  }

  updateStateWith(state) {
    return () => this.setState(state);
  }

  updatePassword(event) {
    const { value } = event.target;
    this.setState({ password: value });
  }

  renderPasswordField() {
    const { componentKey, form, layout, passwordPlaceholder, missingMessage, noLabel, ...rest } = this.props;

    const decoratedInput = BaseInput({
      ...rest,
      form,
      componentKey,
      type: 'password',
      extraRules: [{ validator: antValidate(password) }],
      onChange: this.updatePassword,
      onFocus: this.showPopover,
      onBlur: this.hidePopover,
      missingMessage,
      placeholder: passwordPlaceholder || String.t('labelPasswordPlaceholder')
    });

    if (noLabel) {
      return (
        <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} hasFeedback>
          {decoratedInput}
        </FormItem>
      );
    }
    return (
      <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} label={String.t('labelPassword')} hasFeedback>
        {decoratedInput}
      </FormItem>
    );
  }

  renderConfirmPasswordField() {
    const { placeholder, componentKey, form, layout, noLabel, ...rest } = this.props;

    const comparator = value => value === form.getFieldValue(componentKey);
    const message = String.t('errConfirmPasswordNoMatch');

    const decoratedInput = BaseInput({
      ...rest,
      form,
      componentKey: `${componentKey}Confirm`,
      type: 'password',
      extraRules: [{ validator: antValidate(equality(comparator, { equality: message })) }],
      placeholder: placeholder || String.t('confirmPasswordPlaceholder'),
      missingMessage: String.t('errPasswordMissing')
    });

    if (noLabel) {
      return (
        <FormItem labelCol={layout.labelCol} wrapperCol={layout.wrapperCol} hasFeedback>
          {decoratedInput}
        </FormItem>
      );
    }
    return (
      <FormItem
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        label={String.t('labelConfirmPassword')}
        hasFeedback
      >
        {decoratedInput}
      </FormItem>
    );
  }

  render() {
    if (this.props.vertical) {
      return (
        <div>
          <Row gutter={16} span={12}>
            {this.renderPasswordField()}
          </Row>
          <Row gutter={16} span={12}>
            {this.renderConfirmPasswordField()}
          </Row>
        </div>
      );
    }
    return (
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          {this.renderPasswordField()}
        </Col>
        <Col className="gutter-row" span={12}>
          {this.renderConfirmPasswordField()}
        </Col>
      </Row>
    );
  }
}

ConfirmPasswordField.propTypes = propTypes;
ConfirmPasswordField.defaultProps = defaultProps;

export default ConfirmPasswordField;
