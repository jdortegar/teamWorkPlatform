import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Collapse } from 'antd';
import imageSrcFromFileExtension from 'lib/imageFiles';
import SimpleHeader from '../SimpleHeader';
import './styles/style.css';
// import 'pages/CKGPage/styles/style.css';

const Panel = Collapse.Panel;

const propTypes = {
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
    this.renderSharingLink = this.renderSharingLink.bind(this);
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

  onShareChange(checked, nodeId, tree) {
    if (checked) {
      tree.selected[nodeId] = true; // eslint-disable-line no-param-reassign
    } else {
      delete tree.selected[nodeId]; // eslint-disable-line no-param-reassign
    }

    this.setState(
      {
        primaryTree: tree
      }
    );
  }

  renderSharingLink(nodeId) {
    return (
      <div className="node-sharing-details">
        EDIT SHARING DETAILS
        <a onClick={e => this.onNodeClick(e, nodeId)}><i className="fas fa-angle-right node-sharing-details-icon" /></a>
      </div>
    );
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
      const selected = (tree.selected[node.id]) ? true : false;

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
            {(selected) && this.renderSharingLink(node.id)}
            <div className="node-share">
              <Switch
                checkedChildren="YES"
                unCheckedChildren="NO"
                defaultChecked={selected}
                onChange={(checked) => this.onShareChange(checked, node.id, tree)}
                disabled={false}
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

export default Tree;
