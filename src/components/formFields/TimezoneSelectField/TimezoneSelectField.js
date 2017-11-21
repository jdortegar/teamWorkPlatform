import React from 'react';
import { Form, Select } from 'antd';
import PropTypes from 'prop-types';
import { getAllCountries } from 'countries-and-timezones';
import { formShape } from '../../../propTypes';
import String from '../../../translations';

const FormItem = Form.Item;
const Option = Select.Option;

const timezonesByCountry = getAllCountries();

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
  countryCode: PropTypes.string,
  initialValue: PropTypes.string.isRequired
};

const defaultProps = {
  componentKey: 'timeZone',
  label: String.t('labelTimeZone'),
  layout: {},
  required: false,
  missingMessage: null,
  placeholder: undefined,
  className: '',
  selectClassName: '',
  handleChange: undefined,
  countryCode: null
};

function TimezoneSelectField(props) {
  const {
    componentKey, layout, form, label, required, missingMessage, initialValue,
    placeholder, className, selectClassName, countryCode, ...other
  } = props;

  const translatedMissingMessage = missingMessage || String.t('errTimeZoneNotSelected');
  const translatedPlaceHolder = placeholder || String.t('labelSelectTimeZoneOption');

  let timezones = [];
  if (countryCode) {
    timezones = timezonesByCountry[countryCode].timezones;
  }

  const selectTimezones = timezones.map((timezone) => {
    return <Option key={timezone} value={timezone}>{timezone}</Option>;
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
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          className={selectClassName}
        >
          {selectTimezones}
        </Select>)}
    </FormItem>
  );
}

TimezoneSelectField.propTypes = propTypes;
TimezoneSelectField.defaultProps = defaultProps;

export default TimezoneSelectField;
