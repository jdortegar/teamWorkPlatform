import React from 'react';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import String from '../../../translations';

const propTypes = {
  url: PropTypes.string.isRequired
};

function EditButton(props) {
  return (
    <div className="EditButton__container">
      <Tooltip placement="top" title={String.t('EditButtonLabel')}>
        <Link to={props.url}>
          <div className="EditButton__button">
            <i className="fas fa-pencil-alt" />
          </div>
        </Link>
      </Tooltip>
    </div>
  );
}

EditButton.propTypes = propTypes;

export default EditButton;
