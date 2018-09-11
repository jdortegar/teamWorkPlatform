import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Switch } from 'antd';
import classNames from 'classnames';
// import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import imageSrcFromFileExtension from 'lib/imageFiles';
import SharingSettings from '../SharingSettings';
import Avatar from '../common/Avatar';
import getInitials from '../../utils/helpers';
import { SharingTypes } from '../../redux-hablaai/selectors';
import String from '../../translations';
import './styles/style.css';
// import 'pages/CKGPage/styles/style.css';

const propTypes = {
  primaryTree: PropTypes.object.isRequired,
  secondaryTree: PropTypes.object,
  parentNode: PropTypes.object.isRequired,
  shareWithIds: PropTypes.object.isRequired
};

const defaultProps = {
  secondaryTree: undefined
};

const renderAvatar = item => {
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
  return (
    <Avatar color={preferences.iconColor} className={className}>
      {nameInitial}
    </Avatar>
  );
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
    this.setState({
      primaryTree: tree
    });
  }

  onShareChange(checked, node) {
    const { primaryTree: tree } = this.state;
    const { parentNode, shareWithIds } = this.props;
    if (checked) {
      shareWithIds.addShare(node.id, parentNode.id, SharingTypes.ALL);
    } else {
      shareWithIds.deleteShare(node.id, parentNode.id);
      node.showSharingSettings = false; // eslint-disable-line no-param-reassign
      node.sharingSettingsTree = undefined; // eslint-disable-line no-param-reassign
    }

    this.setState({
      primaryTree: tree
    });
  }

  onShareSettingsClick(e, node) {
    e.preventDefault();
    node.showSharingSettings = !node.showSharingSettings; // eslint-disable-line no-param-reassign

    this.setState({
      primaryTree: this.state.primaryTree
    });
  }

  renderSharingLink(node) {
    node.showSharingSettings = node.showSharingSettings || false; // eslint-disable-line no-param-reassign

    return (
      <div className="node-sharing-details">
        <a onClick={e => this.onShareSettingsClick(e, node)}>
          {String.t('integrationDetailsPage.sharing.editSharingDetails')}
          <i className="fas fa-angle-right" />
        </a>
      </div>
    );
  }

  renderSharingSettings(node) {
    node.sharingSettingsTree = node.sharingSettingsTree || _.cloneDeep(this.state.secondaryTree); // eslint-disable-line no-param-reassign
    const { parentNode, shareWithIds } = this.props;
    const sharingType = shareWithIds.getSharingType(node.id, parentNode.id);
    const allText = String.t('integrationDetailsPage.sharing.shareInAllTeamsAndRooms');
    const customText = String.t('integrationDetailsPage.sharing.shareInSpecificTeamsAndRooms');
    return (
      <div className="sharing-settings-boxed">
        <SharingSettings
          primaryTree={node.sharingSettingsTree}
          sharingType={sharingType}
          allText={allText}
          customText={customText}
          parentNode={node}
          shareWithIds={this.props.shareWithIds}
        />
      </div>
    );
  }

  renderBoxedNodes(nodeArray, tree) {
    return <div className="nodes-boxed">{this.renderNodes(nodeArray, tree)}</div>;
  }

  renderNodes(nodeArray, tree) {
    return nodeArray.map(node => {
      const nodeDetails = tree.nodesById[node.id];
      let icon;
      if (nodeDetails.type === 'FOLDER') {
        icon = (
          <a onClick={e => this.onNodeClick(e, node.id, tree)}>
            <i className="fa fa-folder fa-2x" />
          </a>
        );
      } else if (nodeDetails.type === 'TEAM') {
        const initials = getInitials(nodeDetails.name);
        const className = classNames({ 'opacity-low': !nodeDetails.active });
        const teamIcon = (
          <Avatar size="default" color={nodeDetails.preferences.iconColor} className={className}>
            {initials}
          </Avatar>
        );
        icon = <a onClick={e => this.onNodeClick(e, node.id, tree)}>{teamIcon}</a>;
      } else if (nodeDetails.type === 'TEAMROOM') {
        icon = renderAvatar(nodeDetails);
      } else {
        icon = <img src={imageSrcFromFileExtension(nodeDetails.type)} alt="" width={32} height={32} />;
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
      const childCount = itemsString ? <span className="node-child-count">{itemsString}</span> : '';

      const { parentNode, shareWithIds } = this.props;
      const shared = shareWithIds.getSharingType(node.id, parentNode.id);
      const sharedChecked = shared !== SharingTypes.NONE;

      let selectionField;
      if (this.props.secondaryTree) {
        selectionField = (
          <Switch
            checkedChildren={String.t('integrationDetailsPage.sharing.yes')}
            unCheckedChildren={String.t('integrationDetailsPage.sharing.no')}
            defaultChecked={sharedChecked}
            onChange={checked => this.onShareChange(checked, nodeDetails)}
            disabled={false}
          />
        );
      } else {
        // const shareIcon = 'check-circle';
        // const onOff = (sharedChecked) ? 'node-share-yes' : 'node-share-no';
        selectionField = (
          <a onClick={() => this.onShareChange(!sharedChecked, nodeDetails)}>
            <i className="fas fa-check-circle fa-2x" />
          </a>
        );
      }

      return (
        <div key={node.id}>
          <div className="node integration-sharing-node" key={node.id}>
            <div className="node-icon">{icon}</div>
            <div className="node-info">
              <span className="node-name">{nodeName}</span> &nbsp;
              {childCount}
            </div>
            <div className="node-filler" />
            {this.state.secondaryTree &&
              (shared === SharingTypes.ALL || shared === SharingTypes.SOME) &&
              this.renderSharingLink(nodeDetails)}
            <div className="node-share">{selectionField}</div>
          </div>
          {(shared === SharingTypes.ALL || shared === SharingTypes.SOME) &&
            nodeDetails.showSharingSettings &&
            this.renderSharingSettings(nodeDetails)}
          {node.children &&
            node.children.length > 0 &&
            nodeDetails.expanded &&
            this.renderBoxedNodes(node.children, tree)}
        </div>
      );
    });
  }

  render() {
    const { primaryTree } = this.state;
    const tree = primaryTree;
    const { nodeHierarchy } = tree;

    return <div>{this.renderNodes(nodeHierarchy, tree)}</div>;
  }
}

Tree.propTypes = propTypes;
Tree.defaultProps = defaultProps;

export default Tree;
