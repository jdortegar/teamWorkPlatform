import validate from 'validate.js';

const regex = /(?=.*[!@#$%^&*])/;
const message = 'has at least one special character';

function oneSpecial(value, options) {
  if (!validate.isString(value)) {
    return 'must be a string';
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneSpecial;
