import { PropTypes } from 'prop-types';

const formShape = PropTypes.shape({
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldError: PropTypes.func.isRequired,
  getFieldInstance: PropTypes.func.isRequired,
  getFieldProps: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  getFieldsError: PropTypes.func.isRequired,
  getFieldsValue: PropTypes.func.isRequired,
  isFieldTouched: PropTypes.func.isRequired,
  isFieldValidating: PropTypes.func.isRequired,
  isFieldsTouched: PropTypes.func.isRequired,
  isFieldsValidating: PropTypes.func.isRequired,
  isSubmitting: PropTypes.func.isRequired,
  resetFields: PropTypes.func.isRequired,
  setFields: PropTypes.func.isRequired,
  setFieldsInitialValue: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  validateFields: PropTypes.func.isRequired,
  validateFieldsAndScroll: PropTypes.func.isRequired
});

export default formShape;
