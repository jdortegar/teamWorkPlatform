import validate from 'validate.js';
import * as customValidators from './customValidators';

// add custom validators
Object.assign(validate.validators, customValidators);

// adapters
export { default as antValidate } from './antValidate';
export { validate };

// constraints
export { default as firstName } from './firstName';
export { default as lastName } from './lastName';
export { default as username } from './username';
export { default as email } from './email';
export { default as password } from './password';
export { default as equality } from './equality';
