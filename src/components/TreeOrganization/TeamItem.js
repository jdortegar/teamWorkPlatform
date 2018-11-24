import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import classNames from 'classnames';
import { Icon, Collapse, Row, Col, Tooltip, Switch, message } from 'antd';
import { AvatarWithLabel } from 'src/components';
import String from 'src/translations';

const { Panel } = Collapse;

const handleChangeStatus = (checked, teamId, orgId, updateTeam) => {
  const valuesToSend = { active: checked };

  updateTeam(orgId, teamId, valuesToSend)
    .then(() => {
      message.success(String.t('editTeamPage.teamUpdated'));
    })
    .catch(error => {
      if (error.response && error.response.status === 409) {
        message.error(String.t('editTeamPage.errorNameAlreadyTaken'));
      } else {
        message.error(error.message);
      }
    });
};

const renderTeamMembersLength = teamMembersLength => {
  if (teamMembersLength === 0) {
    return String.t('OrganizationManage.noMembers', { count: teamMembersLength });
  } else if (teamMembersLength === 1) {
    return String.t('OrganizationManage.oneMember', { count: teamMembersLength });
  } else if (teamMembersLength > 1) {
    return String.t('OrganizationManage.manyMembers', { count: teamMembersLength });
  }

  return false;
};

const TeamItem = ({ orgId, team, teamMembersLength, isSelected, onToggleSelection, updateTeam, history, children }) => (
  <div key={team.teamId}>
    <Collapse>
      <Panel
        showArrow={false}
        header={
          <Row className="Tree__item">
            <Col span={6}>
              <a className="Tree__item-link">
                <AvatarWithLabel item={team} enabled={team.active} />
              </a>
            </Col>
            <Col span={12} className="align-left-class Tree__sub_item">
              {renderTeamMembersLength(teamMembersLength)}
            </Col>
            <Col span={2}>
              <Tooltip
                placement="top"
                title={
                  team.active
                    ? String.t('OrganizationManageTeams.setInactive')
                    : String.t('OrganizationManageTeams.setActive')
                }
              >
                <Switch
                  checkedChildren={String.t('OrganizationManageTeams.activeState')}
                  unCheckedChildren={String.t('OrganizationManageTeams.inactiveState')}
                  checked={team.active}
                  onChange={checked => handleChangeStatus(checked, team.teamId, orgId, updateTeam)}
                />
              </Tooltip>
            </Col>
            <Col span={2}>
              <Tooltip
                placement="top"
                title={
                  <div>
                    <span onClick={() => history.push(`/app/editTeam/${team.teamId}`)}>
                      <i className="fas fa-pencil-alt fa-lg" />
                    </span>
                  </div>
                }
              >
                <span className="p-1">
                  <i className="fas fa-ellipsis-h fa-lg" />
                </span>
              </Tooltip>
            </Col>
            <Col span={2}>
              <a
                onClick={event => {
                  event.stopPropagation();
                  onToggleSelection(team.teamId);
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

TeamItem.propTypes = {
  orgId: PropTypes.string.isRequired,
  team: PropTypes.object.isRequired,
  teamMembersLength: PropTypes.number.isRequired,
  onToggleSelection: PropTypes.func.isRequired,
  updateTeam: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  children: PropTypes.node,
  history: PropTypes.object.isRequired
};

TeamItem.defaultProps = {
  isSelected: false,
  children: null
};

export default withRouter(TeamItem);
