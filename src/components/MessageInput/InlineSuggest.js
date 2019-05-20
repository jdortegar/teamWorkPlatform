import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';
import { Input } from 'antd';
import classNames from 'classnames';

import { formShape } from 'src/propTypes';
import {
  filterSuggestions,
  getNeedleFromString,
  getNextSafeIndexFromArray,
  getPreviousSafeIndexFromArray
} from 'src/lib/suggestions';
import Suggestion from './Suggestion';

const KeyEnum = {
  TAB: 9,
  ENTER: 13,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  UP_ARROW: 38
};

const propTypes = {
  form: formShape.isRequired,
  initialValue: PropTypes.string,
  suggestions: PropTypes.array,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  inputProps: PropTypes.object,
  navigate: PropTypes.bool,
  shouldRenderSuggestion: PropTypes.func,
  getSuggestionValue: PropTypes.func,
  onInputFocus: PropTypes.func,
  onInputBlur: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  onMatch: PropTypes.func
};

const defaultProps = {
  initialValue: null,
  suggestions: [],
  navigate: false,
  className: '',
  inputClassName: '',
  inputProps: {},
  getSuggestionValue: null,
  shouldRenderSuggestion: null,
  onInputBlur: null,
  onInputFocus: null,
  onInputChange: null,
  onInputKeyDown: null,
  onMatch: null
};

class InlineSuggest extends React.Component {
  state = { keyword: null, activeIndex: -1 };

  memoizedFilterSuggestions = memoize(filterSuggestions);

  noSuggestions = () => this.state.activeIndex === -1;

  fireOnChange = value => {
    if (this.props.onInputChange) {
      this.props.onInputChange(value);
    }
  };

  handleOnChange = e => {
    const { value } = e.currentTarget;
    const { suggestions, form } = this.props;

    form.setFieldsValue({ message: value });

    const { keyword, suggestionsFound } = this.memoizedFilterSuggestions(
      value,
      suggestions,
      this.extractSuggestionValue
    );

    this.setState({ keyword, activeIndex: suggestionsFound.length > 0 ? 0 : -1 });
    this.fireOnChange(value);
  };

  handleOnBlur = () => {
    if (this.props.onInputBlur) {
      this.props.onInputBlur(this.getValue());
    }
  };

  handleOnKeyDown = e => {
    if (this.props.onInputKeyDown) {
      this.props.onInputKeyDown(e);
    }

    if (this.state.activeIndex === -1) {
      return;
    }

    const { keyCode } = e;
    const { navigate } = this.props;

    const allowedKeyCodes = [KeyEnum.TAB, KeyEnum.UP_ARROW, KeyEnum.DOWN_ARROW];

    if (allowedKeyCodes.includes(keyCode)) {
      e.preventDefault();
    }

    if (navigate && (keyCode === KeyEnum.DOWN_ARROW || keyCode === KeyEnum.UP_ARROW)) {
      const matchedSuggestions = this.getMatchedSuggestions();
      this.setState({
        activeIndex:
          keyCode === KeyEnum.DOWN_ARROW
            ? getNextSafeIndexFromArray(matchedSuggestions, this.state.activeIndex)
            : getPreviousSafeIndexFromArray(matchedSuggestions, this.state.activeIndex)
      });
    }
  };

  handleOnKeyUp = e => {
    const { form } = this.props;
    const { keyCode } = e;

    if (this.state.activeIndex >= 0 && (keyCode === KeyEnum.TAB || keyCode === KeyEnum.RIGHT_ARROW)) {
      const message = `${this.getValue()}${this.getNeedle()}`;

      form.setFieldsValue({ message });
      this.fireOnChange(message);
      this.setState({ keyword: message, activeIndex: -1 });

      if (this.props.onMatch) {
        const matchedSuggestions = this.getMatchedSuggestions();
        const matchedValue = matchedSuggestions[this.state.activeIndex];
        this.props.onMatch(matchedValue);
      }
    }
  };

  getMatchedSuggestions = () => {
    const { suggestionsFound } = this.memoizedFilterSuggestions(
      this.getValue(),
      this.props.suggestions,
      this.extractSuggestionValue
    );
    return suggestionsFound;
  };

  getNeedle = () => {
    const matchedSuggestions = this.getMatchedSuggestions();
    if (!matchedSuggestions[this.state.activeIndex]) return '';

    return getNeedleFromString(
      this.extractSuggestionValue(matchedSuggestions[this.state.activeIndex]),
      this.state.keyword
    );
  };

  extractSuggestionValue = suggestion =>
    this.props.getSuggestionValue ? this.props.getSuggestionValue(suggestion) : String(suggestion);

  getValue = () => {
    const { message } = this.props.form.getFieldsValue();
    return message;
  };

  render() {
    const { form, initialValue, shouldRenderSuggestion, inputClassName, inputProps, onInputFocus } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={classNames('InlineSuggest', this.props.className)}>
        {getFieldDecorator('message', { initialValue })(
          <Input
            className={classNames('InlineSuggest__input', inputClassName)}
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            onKeyDown={this.handleOnKeyDown}
            onKeyUp={this.handleOnKeyUp}
            onFocus={onInputFocus}
            {...inputProps}
          />
        )}
        <Suggestion value={this.getValue()} needle={this.getNeedle()} shouldRenderSuggestion={shouldRenderSuggestion} />
      </div>
    );
  }
}

InlineSuggest.propTypes = propTypes;
InlineSuggest.defaultProps = defaultProps;

export default InlineSuggest;
