import validate from 'validate.js';

const regex = /(?=.*[A-Z])/;
const message = 'has at least one uppercase letter (A-Z)';

function oneUppercase(value, options) {
  if (!validate.isString(value)) {
    return 'must be a string';
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneUppercase;
