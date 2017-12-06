import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Col, Row } from 'antd';
import {
  antValidate,
  equality, password
} from '../../../validations';
import { formShape, layoutShape } from '../../../propTypes';
import BaseInput from '../BaseInput';
import String from '../../../translations';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  componentKey: PropTypes.string,
  initialValue: PropTypes.string,
  placeholder: PropTypes.string,
  layout: layoutShape,
  required: PropTypes.bool,
  missingMessage: PropTypes.string,
  noLabel: PropTypes.bool
};

const defaultProps = {
  componentKey: 'passwordConfirm',
  initialValue: null,
  placeholder: String.t('confirmPasswordPlaceholder'),
  required: true,
  missingMessage: String.t('errPasswordMissing'),
  layout: {},
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
    const value = event.target.value;
    this.setState({ password: value });
  }

  renderPasswordField() {
    const { componentKey, form, layout, placeholder, missingMessage, noLabel, ...rest } = this.props;

    const decoratedInput = BaseInput({
      ...rest,
      form,
      componentKey,
      type: 'password',
      extraRules: [
        { validator: antValidate(password) }
      ],
      onChange: this.updatePassword,
      onFocus: this.showPopover,
      onBlur: this.hidePopover,
      missingMessage,
      placeholder
    });

    if (noLabel) {
      return (
        <FormItem
          labelCol={layout.labelCol}
          wrapperCol={layout.wrapperCol}
          hasFeedback
        >
          {decoratedInput}
        </FormItem>
      );
    }
    return (
      <FormItem
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        label={String.t('labelPassword')}
        hasFeedback
      >
        {decoratedInput}
      </FormItem>
    );
  }

  renderConfirmPasswordField() {
    const { componentKey, form, layout, noLabel, ...rest } = this.props;

    const comparator = value => value === form.getFieldValue(componentKey);
    const message = String.t('errConfirmPasswordNoMatch');

    const decoratedInput = BaseInput({
      ...rest,
      form,
      componentKey: `${componentKey}Confirm`,
      type: 'password',
      extraRules: [
        { validator: antValidate(equality(comparator, { equality: message })) }
      ],
      placeholder: String.t('confirmPasswordPlaceholder'),
      missingMessage: String.t('errPasswordMissing')
    });

    if (noLabel) {
      return (
        <FormItem
          labelCol={layout.labelCol}
          wrapperCol={layout.wrapperCol}
          hasFeedback
        >
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
