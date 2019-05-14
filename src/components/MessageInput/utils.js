export function filterSuggestions(value, suggestions, ignoreCase, getSuggestionValue) {
  if (!value) {
    return [];
  }

  const rx = RegExp(`^${value}`, ignoreCase ? 'i' : undefined);
  return suggestions.filter(suggestion =>
    getSuggestionValue ? rx.test(getSuggestionValue(suggestion)) : rx.test(String(suggestion))
  );
}

export function getNeedleFromString(text, current) {
  return text.replace(text.substr(0, current.length), '');
}

export function getNextSafeIndexFromArray(array, current) {
  return current + 1 > array.length - 1 ? 0 : current + 1;
}

export function getPreviousSafeIndexFromArray(array, current) {
  return current - 1 < 0 ? array.length - 1 : current - 1;
}
