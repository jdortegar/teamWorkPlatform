import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, Radio } from 'antd';
import SimpleHeader from '../SimpleHeader';
import Tree from '../Tree';
import { SharingTypes } from '../../redux-hablaai/selectors';
import String from '../../translations';
import './styles/style.css';
// import 'pages/CKGPage/styles/style.css';

const { Panel } = Collapse;
const RadioGroup = Radio.Group;

const propTypes = {
  primaryTree: PropTypes.object.isRequired,
  secondaryTree: PropTypes.object,
  integrationType: PropTypes.string,
  allText: PropTypes.string.isRequired,
  customText: PropTypes.string.isRequired,
  collapsible: PropTypes.boolean,
  sharingType: PropTypes.string.isRequired,
  parentNode: PropTypes.object.isRequired,
  shareWithIds: PropTypes.object.isRequired
};

const defaultProps = {
  secondaryTree: undefined,
  integrationType: undefined,
  collapsible: false
};

class SharingSettings extends Component {
  constructor(props) {
    super(props);

    const { primaryTree, secondaryTree } = this.props;
    let share;
    if (props.sharingType === SharingTypes.ALL) {
      share = 'all';
    } else if (props.sharingType === SharingTypes.SOME) {
      share = 'custom';
    }
    this.state = {
      share,
      primaryTree,
      secondaryTree
    };

    this.onShareChange = this.onShareChange.bind(this);
  }

  onShareChange(e) {
    e.preventDefault();
    const sharingType = e.target.value;
    const { parentNode, shareWithIds } = this.props;
    shareWithIds.addShare(parentNode.id, 'ROOT', sharingType === 'all' ? SharingTypes.ALL : SharingTypes.SOME);
    this.setState({ share: e.target.value });
  }

  renderContent(primaryTree, secondaryTree) {
    return (
      <div>
        <RadioGroup onChange={this.onShareChange} value={this.state.share}>
          <Radio value="all">{this.props.allText}</Radio>
          <br />
          <Radio value="custom">{this.props.customText}</Radio>
        </RadioGroup>
        <div className="TeamAndTeamRoomList">
          {this.props.collapsible &&
            this.state.share === 'custom' && (
              <div className="integrationTitleLabelContainer">
                <div className="habla-label integration-settings-title-label">
                  {this.props.integrationType} {String.t('integrationDetailsPage.sharing.foldersAndFiles')}
                </div>
                <div className="habla-label integration-settings-sellect-all-label">
                  <a>{String.t('integrationDetailsPage.sharing.selectAll')}</a>
                </div>
                <div className="clear" />
              </div>
            )}
          {this.state.share === 'custom' && (
            <Tree
              primaryTree={primaryTree}
              secondaryTree={secondaryTree}
              parentNode={this.props.parentNode}
              shareWithIds={this.props.shareWithIds}
            />
          )}
        </div>
      </div>
    );
  }

  render() {
    const { primaryTree, secondaryTree } = this.state;
    let content = this.renderContent(primaryTree, secondaryTree);
    if (this.props.collapsible) {
      content = (
        <div className="sharing-settings">
          <Collapse bordered>
            <Panel header={<SimpleHeader text={String.t('integrationDetailsPage.sharing.settings')} />} key="1">
              {content}
            </Panel>
          </Collapse>
        </div>
      );
    } else {
      content = <div className="sharing-settings">{content}</div>;
    }

    return content;
  }
}

SharingSettings.propTypes = propTypes;
SharingSettings.defaultProps = defaultProps;

export default Form.create()(SharingSettings);
