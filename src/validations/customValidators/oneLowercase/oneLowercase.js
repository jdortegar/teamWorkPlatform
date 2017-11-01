import validate from 'validate.js';

const regex = /(?=.*[a-z])/;
const message = 'has at least one lowercase letter (a-z)';

function oneLowercase(value, options) {
  if (!validate.isString(value)) {
    return 'must be a string';
  }

  if (!regex.test(value)) {
    return options.message || message;
  }

  return null;
}

export default oneLowercase;
