import validate from 'validate.js';

const regex = /(?=.*[0-9])/;
const message = 'has at least one number (0-9)';

function oneNumber(value, options) {
  if (!validate.isString(value)) {
    return 'must be a string';
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneNumber;
