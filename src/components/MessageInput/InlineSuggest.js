import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'lodash.memoize';
import { Input } from 'antd';
import classNames from 'classnames';

import { formShape } from 'src/propTypes';
import { AvatarWrapper } from 'src/containers';
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
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  ESC: 27,
  DELETE: 8
};

const propTypes = {
  className: PropTypes.string,
  form: formShape.isRequired,
  getSuggestionValue: PropTypes.func,
  initialValue: PropTypes.string,
  inputClassName: PropTypes.string,
  inputProps: PropTypes.object,
  navigate: PropTypes.bool,
  onInputBlur: PropTypes.func,
  onInputChange: PropTypes.func,
  onInputFocus: PropTypes.func,
  onInputKeyDown: PropTypes.func,
  onMatch: PropTypes.func,
  shouldRenderSuggestion: PropTypes.func,
  suggestions: PropTypes.array,
  users: PropTypes.array
};

const defaultProps = {
  className: '',
  getSuggestionValue: null,
  initialValue: null,
  inputClassName: '',
  inputProps: {},
  navigate: false,
  onInputBlur: null,
  onInputChange: null,
  onInputFocus: null,
  onInputKeyDown: null,
  onMatch: null,
  shouldRenderSuggestion: null,
  suggestions: [],
  users: []
};

class InlineSuggest extends React.Component {
  memoizedFilterSuggestions = memoize(filterSuggestions);

  constructor(props) {
    super(props);

    this.state = {
      keyword: null,
      activeIndex: -1,
      top: null,
      left: null,
      showMentionSuggestor: false,
      filteredUsers: [],
      currentMentionSelection: props.users.length - 1,
      currentText: null
    };
  }

  noSuggestions = () => this.state.activeIndex === -1;

  fireOnChange = value => {
    if (this.props.onInputChange) {
      this.props.onInputChange(value);
    }
  };

  renderMentions = value => {
    const { users } = this.props;
    const filteredUsers = users.filter(el => el.fullName.toLowerCase().includes(value.toLowerCase().trim()));
    this.setState({ filteredUsers, currentMentionSelection: filteredUsers.length - 1 });
  };

  handleOnChange = e => {
    const { value } = e.currentTarget;
    const { suggestions, form } = this.props;
    const { showMentionSuggestor } = this.state;

    form.setFieldsValue({ message: value });

    // Mention Function
    const lastChar = value.slice(-2);
    if (lastChar === ' @' || (lastChar.length === 1 && lastChar.indexOf('@') === 0)) {
      if (!showMentionSuggestor) {
        this.setState({
          currentText: value,
          showMentionSuggestor: true
        });
      }
    } else if (lastChar === ':') {
      // eslint-disable-next-line no-console
      console.log('emoji');
    }
    this.renderMentions(value.split('@').pop());

    // Autocomplete Function
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

  handleUser = userSelected => {
    const { currentText, filteredUsers, currentMentionSelection } = this.state;

    const user = userSelected || filteredUsers[currentMentionSelection];

    this.props.form.setFieldsValue({ message: `${currentText}${user.fullName}` });
    this.setState({
      currentMentionSelection: null,
      currentText: null,
      showMentionSuggestor: false
    });
  };

  handleOnKeyDown = e => {
    const { keyCode } = e;
    const { navigate } = this.props;
    const { showMentionSuggestor, currentMentionSelection, filteredUsers } = this.state;

    // Mention function
    if (showMentionSuggestor && keyCode === KeyEnum.DOWN_ARROW) {
      e.preventDefault();

      this.setState({
        currentMentionSelection:
          currentMentionSelection < filteredUsers.length - 1 ? currentMentionSelection + 1 : filteredUsers.length - 1
      });
    }

    const removeMentionCodes = [KeyEnum.ESC, KeyEnum.DELETE, KeyEnum.LEFT_ARROW];

    if (showMentionSuggestor && removeMentionCodes.includes(keyCode)) {
      this.setState({
        showMentionSuggestor: false
      });
      e.target.focus();
    }

    if (showMentionSuggestor && keyCode === KeyEnum.ENTER) {
      e.preventDefault();
      this.handleUser();
    }

    // Autocomplete function

    if (this.props.onInputKeyDown) {
      this.props.onInputKeyDown(e);
    }

    if (this.state.activeIndex === -1) {
      return;
    }

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
    const { showMentionSuggestor, currentMentionSelection } = this.state;
    const { keyCode } = e;

    // Mention function
    if (showMentionSuggestor && keyCode === KeyEnum.UP_ARROW) {
      e.preventDefault();

      this.setState({
        currentMentionSelection: currentMentionSelection > 1 ? currentMentionSelection - 1 : 0
      });
    } else if (this.state.activeIndex >= 0 && (keyCode === KeyEnum.TAB || keyCode === KeyEnum.RIGHT_ARROW)) {
      // Autocomplete function
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
            type="text"
            className={classNames('InlineSuggest__input', inputClassName)}
            onChange={this.handleOnChange}
            onBlur={this.handleOnBlur}
            onKeyDown={this.handleOnKeyDown}
            onKeyUp={this.handleOnKeyUp}
            onFocus={onInputFocus}
            {...inputProps}
          />
        )}
        {this.state.showMentionSuggestor && (
          <div
            id="dropdown"
            className="InlineSuggest__mention-dropdown"
            style={{
              top: this.state.top,
              left: this.state.left
            }}
          >
            {this.state.filteredUsers.map((user, index) => (
              <div
                className="InlineSuggest__mention-user"
                style={{
                  background: index === this.state.currentMentionSelection ? '#eee' : ''
                }}
                key={user.userId}
                onClick={() => this.handleUser(user)}
              >
                <AvatarWrapper size="default" user={user} showDetails={false} /> {user.fullName}
              </div>
            ))}
          </div>
        )}
        <Suggestion value={this.getValue()} needle={this.getNeedle()} shouldRenderSuggestion={shouldRenderSuggestion} />
      </div>
    );
  }
}

InlineSuggest.propTypes = propTypes;
InlineSuggest.defaultProps = defaultProps;

export default InlineSuggest;
