import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, Radio } from 'antd';
import { formShape } from '../../propTypes';
import SimpleHeader from '../SimpleHeader';
import Tree from '../Tree';
import { SharingTypes } from '../../redux-hablaai/selectors';
import './styles/style.css';
// import 'pages/CKGPage/styles/style.css';

const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;

const propTypes = {
  form: formShape.isRequired,
  nodes: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    selected: PropTypes.boolean,
    children: PropTypes.arrayOf(PropTypes.object)
  }))
};

const defaultProps = {
  nodes: []
};

class SharingSettings extends Component {
  constructor(props) {
    super(props);

    const { primaryTree, secondaryTree,  } = this.props;
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
    shareWithIds.addShare(parentNode.id, 'ROOT', (sharingType === 'all') ? SharingTypes.ALL : SharingTypes.SOME);
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
        {((this.props.collapsible) && (this.state.share === 'custom')) && <div><br /><span>{this.props.integrationType} Folders and Files</span></div>}
        {(this.state.share === 'custom') && <Tree primaryTree={primaryTree} secondaryTree={secondaryTree} parentNode={this.props.parentNode} shareWithIds={this.props.shareWithIds} />}
      </div>
    );
  }

  render() {
    const { primaryTree, secondaryTree } = this.state;
    let content = this.renderContent(primaryTree, secondaryTree);
    if (this.props.collapsible) {
      content = (
        <div className="sharing-settings">
          <hr />
          <Collapse bordered>
            <Panel header={<SimpleHeader text="Sharing Settings" />} key="1">
              {content}
            </Panel>
          </Collapse>
        </div>
      );
    } else {
      content = (
        <div className="sharing-settings">
          {content}
        </div>
      );
    }

    return content;
  }
}

SharingSettings.propTypes = propTypes;
SharingSettings.defaultProps = defaultProps;

export default Form.create()(SharingSettings);
