import { CSSProperties } from 'react';
import PropTypes from 'prop-types';

const { number, string, oneOfType, shape } = PropTypes;

const ColSize = shape({
  span: number,
  order: number,
  offset: number,
  push: number,
  pull: number
});

const ColProps = {
  className: string,
  span: number,
  order: number,
  offset: number,
  push: number,
  pull: number,
  xs: oneOfType([number, ColSize]),
  sm: oneOfType([number, ColSize]),
  md: oneOfType([number, ColSize]),
  lg: oneOfType([number, ColSize]),
  xl: oneOfType([number, ColSize]),
  prefixCls: string,
  style: CSSProperties
};

const layoutShape = PropTypes.shape({
  labelCol: ColProps,
  wrapperCol: ColProps
});

export default layoutShape;
