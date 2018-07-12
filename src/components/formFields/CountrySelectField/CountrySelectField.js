import React, { Component } from 'react';
import { Form, Select } from 'antd';
import PropTypes from 'prop-types';
import { formShape } from '../../../propTypes';
import countriesObj from './countries';
import String from '../../../translations';

const FormItem = Form.Item;
const Option = Select.Option;

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
  selectClassName: PropTypes.string,
  initialValue: PropTypes.string.isRequired
};

const defaultProps = {
  componentKey: 'country',
  label: String.t('labelCountry'),
  layout: {},
  required: false,
  missingMessage: null,
  placeholder: undefined,
  className: '',
  selectClassName: '',
  handleChange: undefined
};

class CountrySelectField extends Component {
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
      selectClassName,
      initialValue,
      ...other
    } = this.props;

    const translatedMissingMessage = missingMessage || String.t('Country.errNoText');
    const translatedPlaceHolder = placeholder || String.t('labelCountryPlaceholder');

    const countries = countriesObj.map(({ name, code }) => {
      return (
        <Option key={code} value={code}>
          {name}
        </Option>
      );
    });

    return (
      <FormItem
        labelCol={layout.labelCol}
        wrapperCol={layout.wrapperCol}
        label={label}
        required={required}
        className={className}
      >
        {form.getFieldDecorator(componentKey, {
          rules: [{ required, message: translatedMissingMessage }],
          initialValue
        })(
          <Select
            {...other}
            showSearch
            placeholder={translatedPlaceHolder}
            optionFilterProp="children"
            onChange={this.handleChange}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            className={selectClassName}
          >
            {countries}
          </Select>
        )}
      </FormItem>
    );
  }
}

CountrySelectField.propTypes = propTypes;
CountrySelectField.defaultProps = defaultProps;

export default CountrySelectField;
