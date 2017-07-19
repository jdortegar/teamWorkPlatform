import React from 'react';
import TextField from 'material-ui/TextField';

function FormTextField(props) {
  const { input, label, meta: { touched, error }, ...custom } = props;

  return (
    <TextField floatingLabelText={label} {...custom} {...input} errorText={touched && error} />
  );
}

export default FormTextField;
