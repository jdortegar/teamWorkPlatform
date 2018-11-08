import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';

import { Link } from 'react-router-dom';
import { Tooltip, Badge, Popover, Menu } from 'antd';
import { Button, BreadCrumb } from 'src/components';
import String from 'src/translations';
import './styles/style.css';

const propTypes = {
  pageBreadCrumb: PropTypes.object,
  menuPageHeader: PropTypes.array,
  menuName: PropTypes.string,
  hasMenu: PropTypes.bool,
  badgeOptions: PropTypes.object,
  buttonOptions: PropTypes.object,
  optionalButtons: PropTypes.object,
  backButton: PropTypes.bool,
  settingsIcon: PropTypes.bool,
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};

const defaultProps = {
  pageBreadCrumb: {},
  menuName: null,
  hasMenu: false,
  badgeOptions: {},
  buttonOptions: {},
  menuPageHeader: [],
  backButton: false,
  optionalButtons: {
    enabled: false
  },
  settingsIcon: false
};

function PageHeader({
  pageBreadCrumb,
  menuName,
  hasMenu,
  badgeOptions,
  menuPageHeader,
  backButton,
  buttonOptions,
  optionalButtons,
  history,
  settingsIcon
}) {
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
    <div className="PageHeader habla-main-content-header padding-class-a border-bottom-light">
      <div className="habla-main-content-header-title">
        {(backButton || hasMenu || settingsIcon) && (
          <div className="actionButtonsContainer">
            {backButton && (
              <Tooltip placement="top" title={String.t('Buttons.back')}>
                <a onClick={() => history.goBack()}>
                  <i className="fas fa-arrow-left fa-2x" />
                </a>
              </Tooltip>
            )}
            {settingsIcon && (
              <span>
                <i className="fa fa-cog" />
              </span>
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
        )}
        <div className="habla-main-content-header-title">
          <h1 className="Subpage-header__title habla-title">
            <BreadCrumb routes={pageBreadCrumb.routes} />
          </h1>
        </div>
        {badgeOptions.enabled && (
          <Badge
            count={badgeOptions.count}
            title="Notifications"
            className="pageHeader__badge"
            style={badgeOptions.style}
          />
        )}
        {!isEmpty(buttonOptions) && <Button className="rightSideButton" {...buttonOptions} />}
        {optionalButtons.enabled && optionalButtons.content}
      </div>
    </div>
  );
}

PageHeader.propTypes = propTypes;
PageHeader.defaultProps = defaultProps;

export default withRouter(PageHeader);
