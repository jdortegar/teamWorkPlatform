import validate from 'validate.js';
import String from 'src/translations';

const regex = /(?=.*[!@#$%^&*])/;
const message = String.t('validationError.passwordOneSpecial');

function oneSpecial(value, options) {
  if (!validate.isString(value)) {
    return String.t('validationError.notAString');
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneSpecial;
