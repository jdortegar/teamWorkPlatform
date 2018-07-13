import React from 'react';
import PropTypes from 'prop-types';
import { VictoryTooltip } from 'victory';
import moment from 'moment';

const CustomTooltip = props => {
  const date = moment(props.datum.x);
  const text = date.isValid() ? [date.format('LL'), ' ', ...props.text] : props.text;

  return <VictoryTooltip {...props} text={text} style={{ padding: 5 }} />;
};

CustomTooltip.propTypes = {
  text: PropTypes.array || PropTypes.string,
  datum: PropTypes.object
};

CustomTooltip.defaultProps = {
  text: [],
  datum: {}
};

export default CustomTooltip;
