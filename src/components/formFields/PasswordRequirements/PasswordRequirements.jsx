import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getValidationMap from './getValidationMap';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  password: PropTypes.string
};

function renderRequirement(validationMap, key) {
  const fulfilled = validationMap[key];
  const message = messages[key];
  const className = classNames('c-password-requirements__requirement', {
    'c-password-requirements__requirement--fulfilled': fulfilled
  });

  return (
    <div className={className}>{message}</div>
  );
}

function PasswordValidation({ password }) {
  const validationMap = getValidationMap(password);

  return (
    <div className="c-password-requirements">
      {renderRequirement(validationMap, 'length')}
      {renderRequirement(validationMap, 'oneLowercase')}
      {renderRequirement(validationMap, 'oneNumber')}
      {renderRequirement(validationMap, 'oneSpecial')}
      {renderRequirement(validationMap, 'oneUppercase')}
    </div>
  );
}

PasswordValidation.propTypes = propTypes;

export default PasswordValidation;
