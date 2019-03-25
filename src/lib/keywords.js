import { take, uniq, words } from 'lodash';

// split by comma and space, transforming "habla AI,Design" into ['habla', 'AI', 'Design']
export const extractKeywords = (string = '', limit) => {
  const keywords = uniq(words(string, /[^, ]+/g));
  return limit ? take(keywords, limit) : keywords;
};

export default { extractKeywords };
