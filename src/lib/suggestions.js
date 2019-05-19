import { startsWith } from 'lodash';

export const filterSuggestions = (value = '', suggestions = [], extractSuggestionValue = v => v) => {
  let keyword = value;
  let suggestionsFound = [];
  let done = false;

  const matchSuggestion = term => suggestion => startsWith(extractSuggestionValue(suggestion), term);

  // don't test if keyword is smaller than 2 letters
  if (keyword && keyword.length >= 2) {
    do {
      /* Check suggestions in a loop, removing the first letter each time.
       * Example: keyword is "So We", and the suggestions include "We are ready."
       * The loop checks "So We", then "o We", then " We", then "We" until we match the suggestion or the keyword has only 2 chars
       */
      suggestionsFound = suggestions.filter(matchSuggestion(keyword));
      done = suggestionsFound.length > 0 || keyword.length <= 2;

      // remove first character and try again
      if (!done) keyword = keyword.slice(1);
    } while (!done);
  }

  return { keyword, suggestionsFound };
};

export const getNeedleFromString = (text, keyword) => text.replace(keyword, '');

export const getNextSafeIndexFromArray = (array, current) => (current + 1 > array.length - 1 ? 0 : current + 1);

export const getPreviousSafeIndexFromArray = (array, current) => (current - 1 < 0 ? array.length - 1 : current - 1);
