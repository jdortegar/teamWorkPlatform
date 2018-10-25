import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon, Row, Col, Tooltip, Switch, message } from 'antd';
import { AvatarWithLabel } from 'src/components';
import { integrationLabelFromKey, integrationImageFromKey, integrationMapping } from 'src/utils/dataIntegrations';
import String from 'src/translations';

const showNotification = (response, integrationKey) => {
  const { status } = response;
  const integrationLabel = integrationLabelFromKey(integrationKey);
  if (status === 200) {
    message.success(String.t('integrationPage.message.successDescription'));
  } else if (status === 410) {
    message.error(String.t('integrationPage.message.goneDescription', { name: integrationLabel }));
  } else {
    message.error(String.t('integrationPage.message.notFoundDescription'));
  }
};

const MemberIntegrationItem = ({ memberIntegration, isSelected, onToggleSelection, revokeIntegration }) => {
  const integration = {
    ...memberIntegration,
    name: integrationLabelFromKey(memberIntegration.key),
    preferences: {
      img: integrationImageFromKey(memberIntegration.key),
      className: classNames({ desaturate: memberIntegration.expired }),
      iconColor: '#FFFFFF'
    }
  };

  // TO DO: Integration URL doesn't work
  const handleIntegration = checked => {
    const key = integrationMapping(integration.key);
    if (checked) {
      message.error(String.t('OrganizationManage.enableIntegrationMessage'));
    } else {
      revokeIntegration(key)
        .then(res => showNotification(res, key))
        .catch(error => {
          message.error(error.message);
        });
    }
  };

  return (
    <Row key={integration.integrationId} className="Tree__item">
      <Col span={5}>
        <a className="Tree__item-link">
          <AvatarWithLabel item={integration} enabled={integration.enabled} />
        </a>
      </Col>
      <Col span={13} className="align-left-class Tree__sub_sub_item">
        {/* {String.t('OrganizationManage.filesShared', { count: integration.files || 0 })} */}
      </Col>
      <Col span={2}>
        <Tooltip
          placement="top"
          title={
            !integration.revoke
              ? String.t('OrganizationManageTeams.setInactive')
              : String.t('OrganizationManageTeams.setActive')
          }
        >
          <Switch
            className="Tree__sub_sub_item_switch"
            checkedChildren={String.t('OrganizationManageTeams.activeState')}
            unCheckedChildren={String.t('OrganizationManageTeams.inactiveState')}
            onChange={checked => handleIntegration(checked)}
            checked={!integration.revoke}
          />
        </Tooltip>
      </Col>
      <Col span={2}>
        <Tooltip
          placement="top"
          title={
            <div>
              <span>
                <i className="fas fa-pencil-alt fa-lg" />
              </span>
            </div>
          }
        >
          <span className="p-1 Tree__sub_sub_item_dots">
            <i className="fas fa-ellipsis-h fa-lg" />
          </span>
        </Tooltip>
      </Col>
      <Col span={2}>
        <a
          onClick={event => {
            event.stopPropagation();
            onToggleSelection(integration, isSelected);
          }}
        >
          <Icon
            type="check-circle"
            theme="filled"
            className={classNames('Tree__item-check-icon', { checked: isSelected })}
          />
        </a>
      </Col>
    </Row>
  );
};

MemberIntegrationItem.propTypes = {
  memberIntegration: PropTypes.object.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  revokeIntegration: PropTypes.func.isRequired
};

MemberIntegrationItem.defaultProps = {
  isSelected: false
};

export default MemberIntegrationItem;
