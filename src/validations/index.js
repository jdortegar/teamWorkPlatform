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

// constraints with i18n

export { constraintI18N as firstNameI18N } from './firstName';
export { constraintI18N as lastNameI18N } from './firstName';
export { constraintI18N as usernameI18N } from './username';
export { constraintI18N as passwordI18N } from './password';
export { constraintI18N as emailI18N } from './email';
export { constraintI18N as equalityI18N } from './equality';

