import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  needle: PropTypes.string.isRequired,
  value: PropTypes.string,
  shouldRenderSuggestion: PropTypes.func
};

const defaultProps = {
  value: '',
  shouldRenderSuggestion: null
};

const Suggestion = ({ needle, shouldRenderSuggestion, value }) => {
  console.warn('Suggestion: ', value);
  if (shouldRenderSuggestion && value && !shouldRenderSuggestion(value)) {
    return null;
  }

  return (
    <span className="InlineSuggest__suggestion">
      {value}
      {needle}
    </span>
  );
};

Suggestion.propTypes = propTypes;
Suggestion.defaultProps = defaultProps;

export default Suggestion;
