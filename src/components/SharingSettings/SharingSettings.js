import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Collapse, Radio } from 'antd';
import { formShape } from '../../propTypes';
import SimpleHeader from '../SimpleHeader';
import Tree from '../Tree';
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

    const { primaryTree, secondaryTree } = this.props;
    this.state = { share: 'all' , primaryTree, secondaryTree };

    this.onShareChange = this.onShareChange.bind(this);
  }

  onShareChange(e) {
    e.preventDefault();
    this.setState({ share: e.target.value });
  }

  render() {
    const { primaryTree, secondaryTree } = this.state;

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical" className="sharing-settings">
        <hr />
        <Collapse bordered>
          <Panel header={<SimpleHeader text="Sharing Settings" />} key="1">
            <RadioGroup onChange={this.onShareChange} value={this.state.share}>
              <Radio value="all">Share all information in all Teams and Team Rooms</Radio>
              <Radio value="custom">Select what to share in specific Teams or Team Rooms</Radio>
            </RadioGroup>
            {(this.state.share === 'custom') && <div><br /><span>Sharepoint Folders and Files</span></div>}
            {(this.state.share === 'custom') && <Tree primaryTree={primaryTree} secondaryTree={secondaryTree} />}
          </Panel>
        </Collapse>
      </Form>
    );
  }
}

SharingSettings.propTypes = propTypes;
SharingSettings.defaultProps = defaultProps;

export default Form.create()(SharingSettings);
