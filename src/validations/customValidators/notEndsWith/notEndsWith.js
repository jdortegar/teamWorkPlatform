import validate from 'validate.js';
import String from 'src/translations';

function notEndsWith(value, { message, searchString }) {
  if (!validate.isString(value)) {
    return String.t('validationError.notAString');
  }

  if (!value.endsWith(searchString)) {
    return null;
  }

  const defaultMessage = String.t('validationError.usernameNotEndsWithPeriod');
  return validate.format(message || defaultMessage, { searchString });
}

export default notEndsWith;
