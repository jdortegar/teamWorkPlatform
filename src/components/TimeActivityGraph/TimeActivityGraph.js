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
const DOT_RADIUS = 6;
const DOT_HOVER_RADIUS = 10;

class TimeActivityGraph extends Component {
  state = {
    xScale: null,
    yScale: null,
    zoomScale: 1
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
    const yScale = d3.scaleTime().range([INNER_HEIGHT, 0]);

    // Scale the range of the data
    xScale.domain([
      moment(d3.min(this.props.files, d => d.date)).subtract(1, 'days'),
      moment(d3.max(this.props.files, d => d.date)).add(1, 'day')
    ]);
    yScale.domain([moment().endOf('day'), moment().startOf('day')]);

    this.setState({ xScale, yScale }, this.createGraph);
  }

  createGraph() {
    this.createInteractiveView();
    this.createXAxis();
    this.createYAxis();
  }

  createInteractiveView() {
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 120])
      .translateExtent([[-100, 0], [INNER_WIDTH + 100, INNER_HEIGHT]])
      .on('zoom', this.handleZoom);

    this.zoom(d3.select(this.nodes.view));
  }

  createXAxis() {
    this.xAxis = d3
      .axisBottom(this.state.xScale)
      .tickSize(-INNER_HEIGHT)
      .tickPadding(10);
    this.xAxis(d3.select(this.nodes.xAxis));
  }

  createYAxis() {
    this.yAxis = d3
      .axisLeft(this.state.yScale)
      .tickFormat(d3.timeFormat('%H:%M'));
    this.yAxis(d3.select(this.nodes.yAxis));
  }

  handleZoom = () => {
    const { x, y, k } = d3.event.transform;
    this.setState({ zoomScale: k });

    d3.select(this.nodes.dataContainer).attr('transform', `translate(${x}, ${y}) scale(${k})`);
    d3.select(this.nodes.xAxis).call(this.xAxis.scale(d3.event.transform.rescaleX(this.state.xScale)));
    d3.select(this.nodes.yAxis).call(this.yAxis.scale(d3.event.transform.rescaleY(this.state.yScale)));
  };

  handleMouseOver = (event) => {
    const component = event.target;
    component.parentNode.appendChild(component); // bring to front
    this.animateCircle(component, DOT_HOVER_RADIUS / this.state.zoomScale);
  };

  handleMouseOut = (event) => {
    this.animateCircle(event.target, DOT_RADIUS / this.state.zoomScale);
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
          <circle
            r={DOT_RADIUS / this.state.zoomScale}
            cx={xScale(file.date)}
            cy={yScale(file.time)}
            fill={file.color}
            stroke="#333"
            strokeWidth={1 / this.state.zoomScale}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
          />
        </Popover>
      );
    });
  }

  render() {
    return (
      <div className="TimeActivityGraph">
        <svg ref={node => this.setNode('graph', node)} className="TimeActivityGraph__graph" width={WIDTH} height={HEIGHT}>
          <defs>
            <clipPath id="clip">
              <rect id="clip-rect" x={0} y={0} width={INNER_WIDTH} height={INNER_HEIGHT} />
            </clipPath>
          </defs>
          <g ref={node => this.setNode('xAxis', node)} className="TimeActivityGraph__axis" transform={`translate(0,${INNER_HEIGHT})`} />
          <g ref={node => this.setNode('yAxis', node)} className="TimeActivityGraph__axis" />
          <g clipPath="url(#clip)">
            <rect
              ref={node => this.setNode('view', node)}
              className="TimeActivityGraph__view"
              x={0}
              y={0}
              width={INNER_WIDTH}
              height={INNER_HEIGHT}
            />
            <g ref={node => this.setNode('dataContainer', node)}>
              {this.renderDataPoints()}
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
