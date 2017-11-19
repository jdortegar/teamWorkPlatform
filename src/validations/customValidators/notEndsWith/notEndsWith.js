import validate from 'validate.js';
import String from '../../../translations';

function notEndsWith(value, { message, searchString }) {
  if (!validate.isString(value)) {
    return String.t('error.validation.notAString');
  }

  if (!value.endsWith(searchString)) {
    return null;
  }

  const defaultMessage = String.t('error.validation.usernameNotEndsWithPeriod');
  return validate.format(message || defaultMessage, { searchString });
}

export default notEndsWith;
