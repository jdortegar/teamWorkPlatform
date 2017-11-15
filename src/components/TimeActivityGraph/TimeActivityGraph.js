import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Popover } from 'antd';
import * as d3 from 'd3';

import './styles/style.css';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

// set the margins and size
const MARGIN = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};
const WIDTH = 860 - MARGIN.left - MARGIN.right;
const HEIGHT = 800 - MARGIN.top - MARGIN.bottom;

class TimeActivityGraph extends Component {
  state = {
    xScale: null,
    yScale: null
  };

  componentDidMount() {
    this.init();
  }

  setNode = (name, node) => {
    this.nodes[name] = node;
  };

  nodes = {
    xAxis: null,
    yAxis: null
  };

  init() {
    // set the ranges
    const xScale = d3.scaleTime().range([0, WIDTH]);
    const yScale = d3.scaleLinear().range([HEIGHT, 0]);

    // Scale the range of the data
    xScale.domain([moment(d3.min(this.props.files, d => d.date)).subtract(1, 'days'), d3.max(this.props.files, d => d.date)]);
    yScale.domain([24, 0]);

    this.setState({ xScale, yScale }, this.createGraph);
  }

  createGraph() {
    this.createXGrid();
    this.createXAxis();
    this.createYAxis();
  }

  createXGrid() {
    const xGrid = d3
      .axisBottom(this.state.xScale)
      .ticks(12)
      .tickSize(-HEIGHT)
      .tickFormat('');

    xGrid(d3.select(this.nodes.xGrid));
  }

  createXAxis() {
    d3.axisBottom(this.state.xScale)(d3.select(this.nodes.xAxis));
  }

  createYAxis() {
    const formatTick = n => (n !== 24 ? d3.timeFormat(`${n}:00`) : null);
    const yAxis = d3.axisLeft(this.state.yScale).tickFormat(formatTick);
    yAxis(d3.select(this.nodes.yAxis));
  }

  handleMouseOver = (event) => {
    const component = event.target;
    component.parentNode.appendChild(component); // bring to front
    this.animateCircle(component, 16);
  };

  handleMouseOut = (event) => {
    this.animateCircle(event.target, 10);
  };

  animateCircle = (component, radius) => {
    d3
      .select(component)
      .transition()
      .duration(500)
      .attr('r', radius);
  };

  renderDataPoints() {
    const { xScale, yScale } = this.state;
    if (!xScale || !yScale) return null;

    return this.props.files.map((file) => {
      const title = (
        <a href={file.resourceUri} target="_blank">
          {file.filename}
        </a>
      );
      const content = (
        <div>
          <p>Activity at {file.displayTime}</p>
          <p>{file.fileSize}</p>
        </div>
      );
      return (
        <Popover key={file.fileId} content={content} title={title} trigger="click">
          <circle r={10} cx={xScale(file.date)} cy={yScale(file.time)} fill={file.color} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
        </Popover>
      );
    });
  }

  render() {
    return (
      <div className="TimeActivityGraph">
        <svg className="TimeActivityGraph__graph" width={WIDTH + MARGIN.left + MARGIN.right} height={HEIGHT + MARGIN.top + MARGIN.bottom}>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`} />
          <g ref={node => this.setNode('xGrid', node)} transform={`translate(0,${HEIGHT})`} className="TimeActivityGraph__grid" />
          <g ref={node => this.setNode('xAxis', node)} transform={`translate(0,${HEIGHT})`} />
          <g ref={node => this.setNode('yAxis', node)} />
          {this.renderDataPoints()}
        </svg>
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
