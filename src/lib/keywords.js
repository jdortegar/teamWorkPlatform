import _ from 'lodash';

// split by comma and space, transforming "habla AI,Design" into ['habla', 'AI', 'Design']
export const extractKeywords = string => _.uniq(_.words(string, /[^, ]+/g));

export default { extractKeywords };
