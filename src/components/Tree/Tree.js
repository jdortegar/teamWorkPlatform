import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import imageSrcFromFileExtension from 'lib/imageFiles';
import { formShape } from '../../propTypes';
import SwitchField from '../formFields/SwitchField';
import './styles/style.css';
// import 'pages/CKGPage/styles/style.css';

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

class Tree extends Component {
  constructor(props) {
    super(props);

    const { primaryTree, secondaryTree } = this.props;
    this.state = { primaryTree, secondaryTree };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onShareChange = this.onShareChange.bind(this);
  }

  onNodeClick(e, nodeId, tree) {
    e.preventDefault();
    const node = tree.nodesById[nodeId];
    node.expanded = !node.expanded;
    this.setState(
      {
        primaryTree: tree
      }
    );
  }

  onShareChange(e, nodeId, tree) {
    e.preventDefault();
    console.log(`AD: onShareChange(${nodeId})`);
  }

  renderBoxedNodes(nodeArray, tree) {
    return (<div className="nodes-boxed">{this.renderNodes(nodeArray, tree)}</div>);
  }

  renderNodes(nodeArray, tree) {
    return nodeArray.map((node) => {
      const nodeDetails = tree.nodesById[node.id];
      let icon;
      if (nodeDetails.type === 'FOLDER') {
        icon = (<a onClick={e => this.onNodeClick(e, node.id, tree)}><i className="fas fa-folder fa-2x node-icon-color" /></a>);
      } else {
        icon = (
          <img
            src={imageSrcFromFileExtension(nodeDetails.type)}
            alt=""
            width={32}
            height={32}
          />
        );
      }

      const nodeName = nodeDetails.name;

      let itemsString;
      if (node.children) {
        const count = node.children.length;
        if (count === 1) {
          itemsString = `(${count} item)`;
        } else {
          itemsString = `(${count} items)`;
        }
      }
      const childCount = (itemsString) ? (<span className="node-child-count">{itemsString}</span>) : '';

      return (
        <div key={node.id}>
          <div className="node" key={node.id}>
            <div className="node-icon">{icon}</div>
            <div className="node-info"><span className="node-name">{nodeName}</span> &nbsp;{childCount}</div>
            <div className="node-filler" />
            <div className="node-share">
              <SwitchField
                disabled={false}
                checkedChildren="YES"
                unCheckedChildren="NO"
                form={this.props.form}
                componentKey={node.id}
                initialValue={false}
                valuePropName="checked"
              />
            </div>
          </div>
          {((node.children) && (node.children.length > 0) && (nodeDetails.expanded)) && this.renderBoxedNodes(node.children, tree)}
          <hr />
        </div>
      );
    });
  }

  render() {
    const { primaryTree, secondaryTree } = this.state;
    const tree = primaryTree;
    const { nodeHierarchy } = tree;

    return (
      <div>
        {this.renderNodes(nodeHierarchy, tree)}
      </div>
    );
  }
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;

export default Form.create()(Tree);
