import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import './styles/style.css';

class BreadCrumb extends React.Component {
  renderAvatar() {
    const { subscriberOrg } = this.props;
    return (
      <span className="breadcrumbs-avatar">
        <Avatar
          styles={{ width: '30px', height: '30px' }}
          name={subscriberOrg.name}
          iconColor={subscriberOrg.preferences.iconColor}
          image={subscriberOrg.preferences.avatarBase64 || subscriberOrg.preferences.logo}
        />
      </span>
    );
  }

  render() {
    const { routes } = this.props;
    return (
      <div className="breadcrumbs-container">
        {routes.map((route, index) => {
          if (route.link) {
            return (
              <span className="breadcrumbs-text" key={index}>
                <Link to={route.link}>
                  {index === 0 &&
                    this.renderAvatar()
                  }
                  <span>{route.title}</span>
                </Link>
                {index < routes.length - 1 &&
                <span className="breadcrumbs-separator">
                  <i className="fas fa-angle-right" />
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
              {index === 0 &&
                this.renderAvatar()
              }
              {route.title}
            </span>
          );
        })}
      </div>
    );
  }
}

BreadCrumb.propTypes = {
  subscriberOrg: PropTypes.object.isRequired,
  routes: PropTypes.array.isRequired
};

export default BreadCrumb;
