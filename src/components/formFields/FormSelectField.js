import React from 'react';
import SelectField from 'material-ui/SelectField';

function FormSelectField(props) {
  const { input, label, meta: { touched, error }, children, ...custom } = props;

  return (
    <SelectField
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      onChange={(event, index, value) => { input.onChange(value) }}
      children={children}
      {...custom}
    />
  );
}

export default FormSelectField;
