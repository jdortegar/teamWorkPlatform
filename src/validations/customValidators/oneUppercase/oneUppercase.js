import validate from 'validate.js';
import String from 'src/translations';

const regex = /(?=.*[A-Z])/;
const message = String.t('validationError.passwordOneUppercase');

function oneUppercase(value, options) {
  if (!validate.isString(value)) {
    return String.t('validationError.notAString');
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneUppercase;
