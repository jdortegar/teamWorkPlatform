import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import String from 'src/translations';
import { OwnerFilter } from 'src/components';
import { Popover } from 'antd';
import './styles/style.css';

const propTypes = {
  owners: PropTypes.array,
  className: PropTypes.string,
  excludeOwnersFilter: PropTypes.array,
  onOwnerFilterClick: PropTypes.func.isRequired
};

const defaultProps = {
  owners: [],
  className: null,
  excludeOwnersFilter: []
};

class FilterUserMessages extends React.Component {
  state = {
    ownersVisible: false
  };

  handleOwnersVisibleChange = visible => {
    this.setState({ ownersVisible: visible });
  };

  render() {
    const { className, owners, excludeOwnersFilter, onOwnerFilterClick } = this.props;

    return (
      <div className={classNames('FilesFilters', className)}>
        <div className="FilesFilters__content">
          {owners.length > 0 && (
            <div className="FilesFilters__group">
              <div className="FilesFilters__dataTypes habla-label">
                <span className="FilesFilters__dataTypes__badge">{owners.length}</span>
              </div>
              {owners.slice(0, 5).map(owner => (
                <OwnerFilter
                  key={owner.userId}
                  owner={owner}
                  count={0}
                  active={excludeOwnersFilter.some(ownerObj => ownerObj.userId === owner.userId)}
                  onClick={() => onOwnerFilterClick(owner.userId)}
                  tooltipTitle={owner.fullName}
                />
              ))}
              {owners.length > 5 && (
                <div className="Filter_Popover">
                  <Popover
                    placement="topLeft"
                    content={
                      <div className="Popover_container">
                        {owners.map(owner => (
                          <OwnerFilter
                            key={owner.userId}
                            owner={owner}
                            count={0}
                            active={excludeOwnersFilter.some(ownerObj => ownerObj.userId === owner.userId)}
                            onClick={() => onOwnerFilterClick(owner.userId)}
                            tooltipTitle={owner.fullName}
                          />
                        ))}
                      </div>
                    }
                    title={String.t('ckgPage.teamMembers', { count: owners.length })}
                    trigger="click"
                    visible={this.state.ownersVisible}
                    onVisibleChange={this.handleOwnersVisibleChange}
                  >
                    <div className="Filters_ellipsis_icon">
                      <i className="fa fa-ellipsis-h" />
                    </div>
                  </Popover>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

FilterUserMessages.propTypes = propTypes;
FilterUserMessages.defaultProps = defaultProps;

export default FilterUserMessages;
