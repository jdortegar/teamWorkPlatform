import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  name: PropTypes.string,
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  minWidth: PropTypes.string,
  type: PropTypes.string
};

const defaultProps = {
  name: null,
  bgColor: null,
  icon: null,
  title: null,
  width: '35px',
  height: '35px',
  minWidth: '35px',
  type: 'text'
}

function UserIcon(props) {
  return (
    <a
      className="user-icon__main-container"
      style={{
        backgroundColor: props.bgColor,
        width: props.width,
        height: props.height,
        minWidth: props.minWidth
      }}
      title={props.title}
    >
      {
        props.type === 'text' ?
          props.name :
          <img
            alt={props.title}
            src={`data:image/png;base64,${props.icon}`}
            style={{
              width: props.width,
              height: props.height,
              minWidth: props.minWidth,
              borderRadius: '3px'
            }}
          />
      }
    </a>
  );
}

UserIcon.propTypes = propTypes;
UserIcon.defaultProps = defaultProps;

export default UserIcon;
