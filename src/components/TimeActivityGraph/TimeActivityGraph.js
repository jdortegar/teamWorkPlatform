import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Popover } from 'antd';
import * as d3 from 'd3';

import './styles/style.css';
import String from '../../translations';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

// set the margins and size
const WIDTH = 860;
const HEIGHT = 700;
const MARGIN = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 50
};
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

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

  xAxis = null;
  yAxis = null;
  nodes = {
    xAxis: null,
    yAxis: null
  };

  init() {
    // set the ranges
    const xScale = d3.scaleTime().range([0, INNER_WIDTH]);
    const yScale = d3.scaleLinear().range([INNER_HEIGHT, 0]);

    // Scale the range of the data
    xScale.domain([moment(d3.min(this.props.files, d => d.date)).subtract(1, 'days'), d3.max(this.props.files, d => d.date)]);
    yScale.domain([24, 0]);

    this.setState({ xScale, yScale }, this.createGraph);
  }

  createGraph() {
    this.createInteractiveView();
    this.createXGrid();
    this.createXAxis();
    this.createYAxis();
  }

  createInteractiveView() {
    const zoom = d3
      .zoom()
      .scaleExtent([1, 3])
      .translateExtent([[-100, 0], [INNER_WIDTH + 100, INNER_HEIGHT]])
      .on('zoom', this.handleZoom);

    zoom(d3.select(this.nodes.view));
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
    this.xAxis = d3.axisBottom(this.state.xScale);
    this.xAxis(d3.select(this.nodes.xAxis));
  }

  createYAxis() {
    const formatTick = n => (n !== 24 ? d3.timeFormat(`${n}:00`) : null);
    this.yAxis = d3.axisLeft(this.state.yScale).tickFormat(formatTick);
    this.yAxis(d3.select(this.nodes.yAxis));
  }

  handleZoom = () => {
    d3.select(this.nodes.dataContainer).attr('transform', d3.event.transform);
    d3.select(this.nodes.xAxis).call(this.xAxis.scale(d3.event.transform.rescaleX(this.state.xScale)));
    d3.select(this.nodes.yAxis).call(this.yAxis.scale(d3.event.transform.rescaleY(this.state.yScale)));
  };

  handleMouseOver = (event) => {
    const component = event.target;
    component.parentNode.appendChild(component); // bring to front
    this.animateCircle(component, 10);
  };

  handleMouseOut = (event) => {
    this.animateCircle(event.target, 6);
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
          <p>{String.t('timeActivityGraph.displayTime', file)}</p>
          <p>{file.fileSize}</p>
        </div>
      );
      return (
        <Popover key={file.fileId} content={content} title={title} trigger="click">
          <circle r={6} cx={xScale(file.date)} cy={yScale(file.time)} fill={file.color} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
        </Popover>
      );
    });
  }

  render() {
    return (
      <div className="TimeActivityGraph">
        <svg ref={node => this.setNode('graph', node)} className="TimeActivityGraph__graph" width={WIDTH} height={HEIGHT}>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`} />
          <g ref={node => this.setNode('xGrid', node)} transform={`translate(0,${INNER_HEIGHT})`} className="TimeActivityGraph__grid" />
          <g ref={node => this.setNode('xAxis', node)} transform={`translate(0,${INNER_HEIGHT})`} />
          <g ref={node => this.setNode('yAxis', node)} />
          <rect ref={node => this.setNode('view', node)} className="TimeActivityGraph__view" x={0.5} y={0.5} width={INNER_WIDTH - 1} height={INNER_HEIGHT - 1} />
          <g ref={node => this.setNode('dataContainer', node)} width={INNER_WIDTH} height={INNER_HEIGHT}>
            {this.renderDataPoints()}
          </g>
        </svg>
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
