import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { Popover, Menu } from 'antd';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  menuPageHeader: PropTypes.arrayOf(PropTypes.object),
  menuName: PropTypes.string,
  pageNameLevelOne: PropTypes.string,
  pageNameLevelTwo: PropTypes.string,
  hasMenu: PropTypes.bool
};

const defaultProps = {
  pageNameLevelOne: 'defaultInfo.pageTitle',
  pageNameLevelTwo: null,
  menuName: null,
  hasMenu: false,
  menuPageHeader: []
};

function PageHeader({ menuName, pageNameLevelOne, pageNameLevelTwo, hasMenu, menuPageHeader }) {
  const menuItems = menuPageHeader.map(
    (item, index) =>
      item.submenu ? (
        <Menu.SubMenu title={String.t(item.title)}>
          {item.submenu.map((subitem, subindex) => (
            <Menu.Item key={item.key || `item-${subindex}`}>
              <Link to={subitem.link || ''}>
                <span className={subitem.className}>
                  <i className={subitem.icon} /> {String.t(subitem.title)}
                </span>
              </Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item key={item.key || `item-${index}`}>
          <Link to={item.link}>
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
          {pageNameLevelTwo && (
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
        <div className="habla-title flexClass-valign-middle breadcrumbLevels">
          <div className={`responsiveHideClass  ${pageNameLevelTwo ? 'habla-title-light' : 'habla-title-normal'}`}>
            {String.t(pageNameLevelOne)}
          </div>
          {pageNameLevelTwo && (
            <div className="flexClass-valign-middle">
              <i className="fas fa-angle-right responsiveHideClass" />
              <div className="habla-title-normal">{String.t(pageNameLevelTwo)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;

export default PageHeader;
