import { startsWith } from 'lodash';

export const filterSuggestions = (value, suggestions, ignoreCase, extractSuggestionValue) => {
  let keyword = value;
  let suggestionsFound = [];
  let done = false;

  const matchSuggestion = term => suggestion => startsWith(extractSuggestionValue(suggestion), term);

  if (keyword && keyword.length >= 2) {
    do {
      suggestionsFound = suggestions.filter(matchSuggestion(keyword));
      done = keyword.length <= 2 || suggestionsFound.length > 0;
      console.warn({ keyword, done });
      if (!done) keyword = keyword.slice(1);
    } while (!done);
  }

  return { keyword, suggestionsFound };
};

export const getNeedleFromString = (text, current, keyword) => {
  console.warn({ text, current, keyword });
  const needle = text.replace(keyword, '');
  console.warn({ needle });
  return needle;
};

export const getNextSafeIndexFromArray = (array, current) => {
  return current + 1 > array.length - 1 ? 0 : current + 1;
};

export const getPreviousSafeIndexFromArray = (array, current) => {
  return current - 1 < 0 ? array.length - 1 : current - 1;
};
