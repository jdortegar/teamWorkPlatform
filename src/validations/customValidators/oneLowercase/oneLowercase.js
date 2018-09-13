import validate from 'validate.js';
import String from '../../../translations';

const regex = /(?=.*[a-z])/;
const message = String.t('validationError.passwordOneLower');

function oneLowercase(value, options) {
  if (!validate.isString(value)) {
    return String.t('validationError.notAString');
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneLowercase;
