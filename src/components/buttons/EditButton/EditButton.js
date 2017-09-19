import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import messages from './messages';
import './styles/style.css';

const propTypes = {
  url: PropTypes.string.isRequired
};

function EditButton(props) {
  return (
    <div className="EditButton__container">
      <Tooltip placement="top" title={messages.edit}>
        <Link to={props.url}>
          <div className="EditButton__button">
            <i className="fa fa-pencil" />
          </div>
        </Link>
      </Tooltip>
    </div>
  );
}

EditButton.propTypes = propTypes;

export default EditButton;
