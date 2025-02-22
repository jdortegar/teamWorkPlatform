import React from 'react';
import PropTypes from 'prop-types';
import './styles/style.css';

const propTypes = {
  children: PropTypes.node.isRequired
};

const NewSubpageHeader = ({ children }) => (
  <div className="habla-main-content-header padding-class-a border-bottom-lighter flexClass">{children}</div>
);

NewSubpageHeader.propTypes = propTypes;

export default NewSubpageHeader;
