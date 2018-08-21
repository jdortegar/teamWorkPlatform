import PropTypes from 'prop-types';
import { Col } from 'antd';

const layoutShape = PropTypes.shape({
  labelCol: PropTypes.shape(Col.propTypes),
  wrapperCol: PropTypes.shape(Col.propTypes)
});

export default layoutShape;
