import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  name: PropTypes.string,
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string
};

const defaultProps = {
  name: null,
  bgColor: null,
  icon: null,
  title: null
}

function UserIcon(props) {
  return (
    <a className="user-icon__main-container" style={{ backgroundColor: props.bgColor }} title={props.title}>
      {props.name}
    </a>
  );
}

UserIcon.propTypes = propTypes;
UserIcon.defaultProps = defaultProps;

export default UserIcon;
