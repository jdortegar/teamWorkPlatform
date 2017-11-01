import validatejs from 'validate.js';

function validate(value, constraints) {
  const result = validatejs({
    value
  }, {
    value: constraints
  }, {
    format: 'grouped',
    fullMessages: false
  });

  if (result === undefined) {
    return result;
  }
  return result.value[0];
}

export default validate;
