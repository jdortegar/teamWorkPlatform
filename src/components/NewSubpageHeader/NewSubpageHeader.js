import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  children: PropTypes.node.isRequired
};

const NewSubpageHeader = ({ children }) => {
  return (
    <div className="subpage__header">
      {children}
    </div>
  );
};

NewSubpageHeader.propTypes = propTypes;

export default NewSubpageHeader;
