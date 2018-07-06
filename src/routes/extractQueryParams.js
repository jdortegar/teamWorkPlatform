import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const extractQueryParams = (props) => {
  const { search } = props.location;
  if (search && search.length > 0) {
    const searchParams = new URLSearchParams(search.slice(1));
    return searchParams ? _.fromPairs(Array.from(searchParams.entries())) : {};
  }
  return {};
};
