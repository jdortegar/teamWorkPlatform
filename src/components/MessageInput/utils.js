export const filterSuggestions = (value, suggestions, ignoreCase, extractSuggestionValue) => {
  let keyword = value;
  let suggestionsFound = [];
  let done = false;

  if (keyword && keyword.length >= 2) {
    do {
      if (keyword.trim().length >= 2) {
        const rx = RegExp(`^${keyword}`, ignoreCase ? 'i' : undefined);
        console.warn({ rx, key: `^${keyword}`, result: rx.test(extractSuggestionValue(suggestions[87])) });
        suggestionsFound = suggestions.filter(s => rx.test(extractSuggestionValue(s)));
      }

      done = keyword.length <= 2 || suggestionsFound.length > 0;
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
