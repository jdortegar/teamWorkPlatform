import validate from 'validate.js';

const defaultMessage = 'cannot end with character %{searchString}';

function notEndsWith(value, { message, searchString }) {
  if (!validate.isString(value)) {
    return 'must be a string';
  }

  if (!value.endsWith(searchString)) {
    return null;
  }

  return validate.format(message || defaultMessage, { searchString });
}

export default notEndsWith;
