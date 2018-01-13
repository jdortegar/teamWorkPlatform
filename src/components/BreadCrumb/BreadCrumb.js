import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './styles/style.css';

const BreadCrumb = (props) => {
  return (
    <span>
      {props.routes.map((route, index) => {
        if (route.link) {
          return (
            <span key={index}>
              <Link to={route.link}>
                <span className="breadcrumb_underline">{route.title}</span>
              </Link>
              {index < props.routes.length - 1 &&
                <span className="breadcrumbs-separator">
                  <i className="fa fa-angle-right fa-1" aria-hidden="true" />
                </span>
              }
            </span>
          );
        }
        return (
          <span key={index}>{route.title}</span>
        );
      })}
    </span>
  );
};

BreadCrumb.propTypes = {
  routes: PropTypes.array.isRequired
};

export default BreadCrumb;
