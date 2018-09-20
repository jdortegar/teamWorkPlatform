import validate from 'validate.js';
import String from 'src/translations';

const regex = /(?=.*[0-9])/;
const message = String.t('validationError.passwordOneNumber');

function oneNumber(value, options) {
  if (!validate.isString(value)) {
    return String.t('validationError.notAString');
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneNumber;
