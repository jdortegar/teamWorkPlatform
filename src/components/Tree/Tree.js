import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'antd';
import classNames from 'classnames';
import imageSrcFromFileExtension from 'lib/imageFiles';
import SharingSettings from '../SharingSettings';
import Avatar from '../common/Avatar';
import getInitials from '../../utils/helpers';
import { SharingTypes } from '../../redux-hablaai/selectors';
import './styles/style.css';
// import 'pages/CKGPage/styles/style.css';

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

const renderAvatar = (item) => {
  const { preferences } = item;
  const className = classNames({
    'opacity-low': false
  });
  if (preferences.logo) {
    return <Avatar src={preferences.logo} color="#FFF" className={className} />;
  }
  if (preferences.avatarBase64) {
    return <Avatar src={`data:image/jpeg;base64, ${preferences.avatarBase64}`} className={className} />;
  }
  const nameInitial = item.name.substring(0, 1).toUpperCase();
  return <Avatar color={preferences.iconColor} className={className}>{nameInitial}</Avatar>;
};

class Tree extends Component {
  constructor(props) {
    super(props);

    const { primaryTree, secondaryTree } = this.props;
    this.state = { primaryTree, secondaryTree };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onShareChange = this.onShareChange.bind(this);
    this.renderSharingLink = this.renderSharingLink.bind(this);
    this.onShareSettingsClick = this.onShareSettingsClick.bind(this);
    this.renderSharingSettings = this.renderSharingSettings.bind(this);
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

  onShareChange(checked, node) {
    const { primaryTree: tree } = this.state;
    console.log(`AD: ${node.id} checked=${checked}`);
    const { parentNode, shareWithIds } = this.props;
    if (checked) {
      node.share = SharingTypes.ALL; // eslint-disable-line no-param-reassign
    } else {
      node.share = SharingTypes.NONE; // eslint-disable-line no-param-reassign
      node.showSharingSettings = false; // eslint-disable-line no-param-reassign
      node.sharingSettingsTree = undefined; // eslint-disable-line no-param-reassign
    }

    this.setState(
      {
        primaryTree: tree
      }
    );
  }

  onShareSettingsClick(e, node) {
    e.preventDefault();
    node.showSharingSettings = !(node.showSharingSettings); // eslint-disable-line no-param-reassign

    this.setState(
      {
        primaryTree: this.state.primaryTree
      }
    );
  }

  renderSharingLink(node) {
    node.showSharingSettings = node.showSharingSettings || false; // eslint-disable-line no-param-reassign
    let shareIcon;
    if (node.showSharingSettings) {
      shareIcon = 'fa-angle-down';
    } else {
      shareIcon = 'fa-angle-right';
    }

    return (
      <div className="node-sharing-details">
        EDIT SHARING DETAILS
        <a onClick={e => this.onShareSettingsClick(e, node)}><i className={`fas ${shareIcon} node-sharing-details-icon`} /></a>
      </div>
    );
  }

  renderSharingSettings(node) {
    node.sharingSettingsTree = node.sharingSettingsTree || _.cloneDeep(this.state.secondaryTree); // eslint-disable-line no-param-reassign
    const sharingType = node.share;
    const allText = 'SHARE IN ALL TEAMS AND TEAM ROOMS';
    const customText = 'SHARE ONLY ON SPECIFIC TEAMS AND TEAM ROOMS';
    return (
      <div className="sharing-settings-boxed"><SharingSettings primaryTree={node.sharingSettingsTree} sharingType={sharingType} allText={allText} customText={customText} parentNode={node} shareWithIds={this.props.shareWithIds} /></div>
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
        icon = (<a onClick={e => this.onNodeClick(e, node.id, tree)}><i className="fas fa-folder fa-2x node-icon-color"/></a>);
      } else if (nodeDetails.type === 'TEAM') {
        const initials = getInitials(nodeDetails.name);
        const className = classNames({ 'opacity-low': !nodeDetails.active });
        const teamIcon = (
          <Avatar size="default" color={nodeDetails.preferences.iconColor} className={className}>
            {initials}
          </Avatar>
        );
        icon = (<a onClick={e => this.onNodeClick(e, node.id, tree)}>{teamIcon}</a>);
      } else if (nodeDetails.type === 'TEAMROOM') {
        icon = renderAvatar(nodeDetails);
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

      let shared;
      if (nodeDetails.share) {
        shared = nodeDetails.share;
      } else {
        const { parentNode, shareWithIds } = this.props;
        if (shareWithIds[node.id]) {
          shared = shareWithIds[node.id][parentNode.id] || SharingTypes.NONE;
        } else {
          shared = SharingTypes.NONE;
        }
      }
      const sharedChecked = (shared === SharingTypes.NONE) ? false : true;

      let selectionField;
      if (this.props.secondaryTree) {
        selectionField = (
          <Switch
            checkedChildren="YES"
            unCheckedChildren="NO"
            defaultChecked={sharedChecked}
            onChange={checked => this.onShareChange(checked, nodeDetails)}
            disabled={false}
          />
        );
      } else {
        const shareIcon = 'fa-check-circle';
        const onOff = (sharedChecked) ? 'node-share-yes' : 'node-share-no';
        selectionField = (<a onClick={() => this.onShareChange(!sharedChecked, nodeDetails)}><i className={`fas ${shareIcon} fa-2x ${onOff}`} /></a>);
      }

      return (
        <div key={node.id}>
          <div className="node" key={node.id}>
            <div className="node-icon">{icon}</div>
            <div className="node-info"><span className="node-name">{nodeName}</span> &nbsp;{childCount}</div>
            <div className="node-filler" />
            {(this.state.secondaryTree) && ((nodeDetails.share === SharingTypes.ALL) || (nodeDetails.share === SharingTypes.SOME)) && this.renderSharingLink(nodeDetails)}
            <div className="node-share">
              {selectionField}
            </div>
          </div>
          {(((nodeDetails.share === SharingTypes.ALL) || (nodeDetails.share === SharingTypes.SOME)) && (nodeDetails.showSharingSettings)) && this.renderSharingSettings(nodeDetails)}
          {((node.children) && (node.children.length > 0) && (nodeDetails.expanded)) && this.renderBoxedNodes(node.children, tree)}
          <hr />
        </div>
      );
    });
  }

  render() {
    const { primaryTree } = this.state;
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
