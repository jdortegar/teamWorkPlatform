import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import classNames from 'classnames';
import { Icon, Collapse, Row, Col, Tooltip, Switch, message } from 'antd';
import { AvatarWithLabel } from 'src/components';
import String from 'src/translations';

const { Panel } = Collapse;

const handleChangeStatus = (checked, userId, teamId, orgId, updateTeamMember) => {
  const valuesToSend = { active: checked };

  updateTeamMember(orgId, teamId, userId, valuesToSend)
    .then(() => {
      message.success(String.t('OrganizationManage.teamMemberUpdated'));
    })
    .catch(error => {
      message.error(error.message);
    });
};

const TeamMemberItem = ({
  orgId,
  teamMember,
  teamId,
  isSelected,
  onToggleSelection,
  children,
  updateTeamMember,
  history
}) => (
  <div key={teamMember.userId}>
    <Collapse>
      <Panel
        showArrow={false}
        header={
          <Row className="Tree__item">
            <Col span={6}>
              <a className="Tree__item-link">
                <AvatarWithLabel item={teamMember} enabled={teamMember.active} />
              </a>
            </Col>
            <Col span={12} className="align-left-class">
              {teamMember.email}
            </Col>
            <Col span={2}>
              <Tooltip
                placement="top"
                title={
                  teamMember.active
                    ? String.t('OrganizationManageTeams.setInactive')
                    : String.t('OrganizationManageTeams.setActive')
                }
              >
                <Switch
                  className="Tree__sub_item_switch"
                  checkedChildren={String.t('OrganizationManageTeams.activeState')}
                  unCheckedChildren={String.t('OrganizationManageTeams.inactiveState')}
                  onChange={checked => handleChangeStatus(checked, teamMember.userId, teamId, orgId, updateTeamMember)}
                  checked={teamMember.active}
                />
              </Tooltip>
            </Col>
            <Col span={2}>
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => history.push(`/app/editTeamMember/${teamMember.userId}`)}>
                      <i className="fas fa-pencil-alt fa-lg" />
                    </span>
                  </div>
                }
              >
                <span className="p-1 Tree__sub_item_dots">
                  <i className="fas fa-ellipsis-h fa-lg" />
                </span>
              </Tooltip>
            </Col>
            <Col span={2}>
              <a
                onClick={event => {
                  event.stopPropagation();
                  onToggleSelection(teamMember.userId, teamId);
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
        }
      >
        <div className="Tree__subtree">{children}</div>
      </Panel>
    </Collapse>
  </div>
);

TeamMemberItem.propTypes = {
  orgId: PropTypes.string.isRequired,
  teamId: PropTypes.string.isRequired,
  teamMember: PropTypes.object.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
  updateTeamMember: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

TeamMemberItem.defaultProps = {
  isSelected: false,
  children: null
};

export default withRouter(TeamMemberItem);
