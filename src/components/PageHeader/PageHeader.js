import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Tooltip, Badge, Popover, Menu, Button } from 'antd';
import { BreadCrumb } from 'src/components';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  pageBreadCrumb: PropTypes.object,
  menuPageHeader: PropTypes.array,
  menuName: PropTypes.string,
  hasMenu: PropTypes.bool,
  hasNotification: PropTypes.bool,
  buttonOptions: PropTypes.object,
  backButton: PropTypes.string
};

const defaultProps = {
  pageBreadCrumb: {},
  menuName: null,
  hasMenu: false,
  hasNotification: false,
  buttonOptions: {
    enabled: false
  },
  menuPageHeader: [],
  backButton: ''
};

function PageHeader({ pageBreadCrumb, menuName, hasMenu, hasNotification, menuPageHeader, backButton, buttonOptions }) {
  const menuItems = menuPageHeader.map(
    item =>
      item.submenu ? (
        <Menu.SubMenu title={String.t(item.title)} key={item.key || item.title}>
          {item.submenu.map(subitem => (
            <Menu.Item key={subitem.key || subitem.title}>
              <Link to={subitem.url || ''}>
                <span className={subitem.className}>
                  <i className={subitem.icon} /> {String.t(subitem.title)}
                </span>
              </Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key || item.title}>
          <Link to={item.url}>
            <span className={item.className}>
              <i className={item.icon} /> {String.t(item.title)}
            </span>
          </Link>
        </Menu.Item>
      )
  );

  const buttonMenu = (
    <Menu mode="vertical" className="pageHeaderMenu">
      {menuItems}
    </Menu>
  );

  return (
    <div className="habla-main-content-header padding-class-a border-bottom-lighter">
      <div className="habla-main-content-header-title">
        <div className="actionButtonsContainer">
          {backButton !== '' && (
            <Tooltip placement="top" title={String.t('subPageHeader.linkToCKG')}>
              <Link to={backButton}>
                <i className="fas fa-arrow-left fa-2x" />
              </Link>
            </Tooltip>
          )}
          {pageBreadCrumb.routes.length > 2 && (
            <Link to={pageBreadCrumb.routes[0].url}>
              <i className="fas fa-arrow-left fa-2x" />
            </Link>
          )}
          {hasMenu && (
            <Popover placement="bottomLeft" title={String.t(menuName)} content={buttonMenu} trigger="click">
              <a>
                <i className="fas fa-bars fa-2x" />
                <i className="fas fa-chevron-down" />
              </a>
            </Popover>
          )}
        </div>
        <div className="habla-main-content-header-title">
          <h1 className="Subpage-header__title habla-title">
            <BreadCrumb routes={pageBreadCrumb.routes} />
          </h1>
        </div>
        {hasNotification && (
          <Badge
            count={0}
            title="Notifications"
            style={{ justifyContent: 'flex-end', boxShadow: '#AB1E16 -1px -1px 0px 0px inset' }}
          />
        )}
        {buttonOptions.enabled && (
          <Button
            type="main"
            className={buttonOptions.className}
            onClick={buttonOptions.clickFunction}
            loading={buttonOptions.loading}
          >
            {buttonOptions.children}
          </Button>
        )}
      </div>
    </div>
  );
}

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;

export default PageHeader;
