import validate from './validate';

function antValidate(constraints) {
  if (constraints == null) {
    throw new Error('constraints cannot be empty');
  }

  return (rule, value, callback) => (
    callback(validate(value, constraints))
  );
}

export default antValidate;
