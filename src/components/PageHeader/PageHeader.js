import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Popover, Menu } from 'antd';
import { BreadCrumb } from 'src/components';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  pageBreadCrumb: PropTypes.object,
  menuPageHeader: PropTypes.array,
  menuName: PropTypes.string,
  hasMenu: PropTypes.bool
};

const defaultProps = {
  pageBreadCrumb: {},
  menuName: null,
  hasMenu: false,
  menuPageHeader: []
};

function PageHeader({ pageBreadCrumb, menuName, hasMenu, menuPageHeader }) {
  const menuItems = menuPageHeader.map(
    (item, index) =>
      item.submenu ? (
        <Menu.SubMenu title={String.t(item.title)}>
          {item.submenu.map((subitem, subindex) => (
            <Menu.Item key={item.key || `item-${subindex}`}>
              <Link to={subitem.url || ''}>
                <span className={subitem.className}>
                  <i className={subitem.icon} /> {String.t(subitem.title)}
                </span>
              </Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key || `item-${index}`}>
          <Link to={item.url}>
            <span className="item.class">
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
          {pageBreadCrumb.routes.length > 1 && (
            <a>
              <i className="fas fa-arrow-left fa-2x" />
            </a>
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
            <BreadCrumb subscriberOrg={pageBreadCrumb.subscriberOrg} routes={pageBreadCrumb.routes} />
          </h1>
        </div>
      </div>
    </div>
  );
}

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;

export default PageHeader;
