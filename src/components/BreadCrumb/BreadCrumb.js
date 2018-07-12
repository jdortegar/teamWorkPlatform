import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from 'components/common/Avatar';
import './styles/style.css';

class BreadCrumb extends React.Component {
  renderAvatar() {
    const { subscriberOrg } = this.props;
    const avatarClass = 'mr-1';
    if (subscriberOrg.preferences.avatarBase64) {
      return (
        <Avatar className={avatarClass} src={`data:image/jpeg;base64, ${subscriberOrg.preferences.avatarBase64}`} />
      );
    } else if (subscriberOrg.preferences.logo) {
      return <Avatar className="{avatarClass}" color="#FFF" src={subscriberOrg.preferences.logo} />;
    }
    const initial = subscriberOrg.name.substring(0, 1).toUpperCase();
    return (
      <Avatar color={subscriberOrg.preferences.iconColor} className={avatarClass}>
        {initial}
      </Avatar>
    );
  }

  render() {
    const { routes } = this.props;
    return (
      <div className="breadcrumbs-container">
        {routes.map((route, index) => {
          if (route.link) {
            return (
              <span className="breadcrumbs-text responsiveHideClass" key={index}>
                <Link to={route.link}>
                  <span>{route.title}</span>
                </Link>
                {index < routes.length - 1 && (
                  <span className="breadcrumbs-separator">
                    <i className="fas fa-angle-right" />
                  </span>
                )}
              </span>
            );
          }
          return (
            <span className="breadcrumbs-text" key={index}>
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
