import validate from './validate';
import String from '../../translations';

function antValidate(constraints) {
  if (constraints == null) {
    throw new Error(String.t('validationError.constraintsEmpty'));
  }

  return (rule, value, callback) => callback(validate(value, constraints));
}

export default antValidate;
