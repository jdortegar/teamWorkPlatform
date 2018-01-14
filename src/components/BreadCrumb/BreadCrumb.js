import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import './styles/style.css';

const BreadCrumb = (props) => {
  const { subscriberOrg } = props;
  return (
    <div className="breadcrumbs-container">
      <div className="breadcrumbs-avatar">
        <Avatar
          styles={{ width: '2em', height: '2em' }}
          name={subscriberOrg.name}
          iconColor={subscriberOrg.preferences.iconColor}
          image={subscriberOrg.preferences.avatarBase64 || subscriberOrg.preferences.logo}
        />
      </div>
      {props.routes.map((route, index) => {
        if (route.link) {
          return (
            <span className="breadcrumbs-text" key={index}>
              <Link to={route.link}>
                <span>{route.title}</span>
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
          <span
            className="breadcrumbs-text"
            key={index}
          >
            {route.title}
          </span>
        );
      })}
    </div>
  );
};

BreadCrumb.propTypes = {
  subscriberOrg: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired
};

export default BreadCrumb;
