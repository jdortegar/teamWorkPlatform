import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon, Menu, Switch } from 'antd';
import String from 'src/translations';
import './style.css';

class SearchMenu extends Component {
  state = { visible: false };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  renderOverlay() {
    const { caseSensitive, andOperator } = this.props;

    return (
      <Menu className="SearchMenu">
        <Menu.Item key="title">
          <div className="habla-label">{String.t('Header.searchMenuTitle')}</div>
        </Menu.Item>
        <Menu.Item key="caseSensitive" className="SearchMenu__item">
          <span>{String.t('Header.searchCaseSensitive')}</span>
          <Switch
            size="small"
            className="SearchMenu__switch"
            checked={caseSensitive}
            onChange={this.props.onToggleCaseSensitive}
          />
        </Menu.Item>
        <Menu.Item key="andOperator" className="SearchMenu__item">
          <span>{String.t('Header.searchAndOperator')}</span>
          <Switch
            size="small"
            className="SearchMenu__switch"
            checked={andOperator}
            onChange={this.props.onToggleAndOperator}
          />
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { visible } = this.state;

    return (
      <Dropdown
        overlay={this.renderOverlay()}
        trigger={['click']}
        visible={visible}
        onVisibleChange={this.handleVisibleChange}
      >
        <a>
          <Icon type="down" className="SearchMenu__dropdown-icon" />
        </a>
      </Dropdown>
    );
  }
}

SearchMenu.propTypes = {
  onToggleCaseSensitive: PropTypes.func.isRequired,
  onToggleAndOperator: PropTypes.func.isRequired,
  caseSensitive: PropTypes.bool,
  andOperator: PropTypes.bool
};

SearchMenu.defaultProps = {
  caseSensitive: false,
  andOperator: false
};

export default SearchMenu;
