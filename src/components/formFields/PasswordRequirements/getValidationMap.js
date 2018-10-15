import { password as passwordRules, validate } from 'src/validations';

const defaultValidationMap = {
  length: true,
  oneLowercase: true,
  oneNumber: true,
  oneSpecial: true,
  oneUppercase: true
};

function getValidationMap(password) {
  const result = validate(
    {
      password
    },
    {
      password: passwordRules
    },
    {
      format: 'constraint'
    }
  );

  // always use a copy
  const validationMap = Object.assign({}, defaultValidationMap);

  if (result === undefined) {
    return validationMap;
  }

  return result.password.reduce((accumulator, current) => {
    validationMap[current] = false;
    return accumulator;
  }, validationMap);
}

export default getValidationMap;
