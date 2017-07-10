import React from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap/lib';
import cssModules from 'react-css-modules';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { routesPaths } from '../../routes';
import styles from './styles.scss';

const Header = () => {
  const user = {
    displayName: 'Anthony Daga',
    icon: null,
    preferences: {
      iconColor: 'red'
    }
  };
  const iconWidth = '30px';

  return (
    <div styleName="header">
      <div className="row">
        <div className="row teamroom-header-login">
          <div className="col-md-3">
            <Link to="/">
              <img className="logo-header" src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" alt="Habla AI" />
            </Link>
            {/* TODO: Remove these 2 links.  Examples only.  Also remove the target pages, as they are also examples. */}
            <Link to={routesPaths.home}>Home</Link>
            <Link to={routesPaths.subpage}>Subpage</Link>
          </div>
          <div className="col-md-6 team-header-icons-nav">
            <div className="team-header-icon">
              <i className="fa fa-newspaper-o" />
              <div className="team-header-nav-text">
                TEAM
              </div>
            </div>
            <div className="team-header-icon">
              <i className="fa fa-bolt" />
              <div className="team-header-nav-text">
                CCG
              </div>
            </div>
            <div className="team-header-icon">
              <i className="fa fa-comments" />
              <div className="team-header-nav-text">
                MESSAGING
              </div>
            </div>
            <div className="team-header-icon">
              <i className="fa fa-calendar-o" />
              <div className="team-header-nav-text">
                CALENDAR
              </div>
            </div>
          </div>

          <div className="col-md-3 user-avatar-container">
            <div className="user-avatar">
              <div className="user-avatar-image-text">
                <DropdownButton
                  id="avatar-dropdown"
                  title={user.icon == null ?
                    (<div className="user-avatar-image user-avatar-item" style={{ backgroundColor: user.preferences.iconColor, borderRadius: '5px', width: '30px', height: '30px', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                        <p>{user.displayName}</p>

                      </div>
                    )
                    : (<img src={user} className="user-avatar-image user-avatar-item" data-toggle="dropdown" alt={user.displayName} />)
                  }
                  noCaret
                  className="avatar-button clearpadding"
                >
                  <LinkContainer to="/profile-edit"><MenuItem eventKey="1"><i className="fa fa-envelope fa-fw" style={{ width: iconWidth, textAlign: 'left' }} /> User Profile</MenuItem></LinkContainer>
                  <LinkContainer to="/org-profile"><MenuItem eventKey="2"><i className="fa fa-sitemap" style={{ width: iconWidth, textAlign: 'left' }} /> Your Organizations</MenuItem></LinkContainer>
                  <LinkContainer to="/summarization"><MenuItem eventKey="3"><i className="fa fa-snowflake-o" style={{ width: iconWidth, textAlign: 'left' }} /> Summarization</MenuItem></LinkContainer>
                  <MenuItem eventKey="3"><i className="fa fa-gear fa-fw" style={{ width: iconWidth, textAlign: 'left' }} /> Settings</MenuItem>
                  <MenuItem divider />
                  <MenuItem eventKey="4"><i className="fa fa-sign-out fa-fw" style={{ width: iconWidth, textAlign: 'left' }} /> Logout</MenuItem>
                </DropdownButton>

                <div className="user-avatar-text user-avatar-item">{user.displayName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default cssModules(Header, styles, { allowMultiple: true });
