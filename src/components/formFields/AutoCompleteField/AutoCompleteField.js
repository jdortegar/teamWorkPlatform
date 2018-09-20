import React, { Component } from 'react';
import { Form, AutoComplete, Input } from 'antd';
import PropTypes from 'prop-types';

import String from 'src/translations';
import { formShape } from 'src/propTypes';

const FormItem = Form.Item;

const propTypes = {
  form: formShape.isRequired,
  componentKey: PropTypes.string,
  handleChange: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  layout: PropTypes.object,
  required: PropTypes.bool,
  missingMessage: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  dataSource: PropTypes.array.isRequired,
  autoCompleteClassName: PropTypes.string
};

const defaultProps = {
  componentKey: 'autocomplete',
  label: String.t('AutoCompleteField.defaultLabel'),
  layout: {},
  required: false,
  missingMessage: null,
  placeholder: undefined,
  className: '',
  autoCompleteClassName: '',
  handleChange: undefined
};

class AutoCompleteField extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    const { handleChange } = this.props;
    if (handleChange) {
      handleChange(value);
    }
  }

  render() {
    const {
      componentKey,
      layout,
      form,
      label,
      required,
      missingMessage,
      placeholder,
      className,
      autoCompleteClassName,
      dataSource,
      ...other
    } = this.props;

    const translatedMissingMessage = missingMessage || String.t('AutoCompleteField.errNoText');
    const translatedPlaceHolder = placeholder || String.t('AutoCompleteField.defaultLabel');

    return (
      <FormItem
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        label={label}
        required={required}
        className={className}
      >
        {form.getFieldDecorator(componentKey, {
          rules: [{ required, message: translatedMissingMessage }]
        })(
          <AutoComplete
            {...other}
            dataSource={dataSource}
            onChange={this.handleChange}
            placeholder={translatedPlaceHolder}
            autoCompleteClassName={autoCompleteClassName}
          >
            <Input name={componentKey} />
          </AutoComplete>
        )}
      </FormItem>
    );
  }
}

AutoCompleteField.propTypes = propTypes;
AutoCompleteField.defaultProps = defaultProps;

export default AutoCompleteField;
