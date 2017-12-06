import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as d3 from 'd3';

import DataPoint from './DataPoint';
import './styles/style.css';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

// set the margins and size
const WIDTH = 400;
const HEIGHT = 300;
const MARGIN = {
  top: 50,
  right: 20,
  bottom: 60,
  left: 50
};
const INNER_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
const DOT_RADIUS = 6;
const DOT_HOVER_RADIUS = 10;

const calculateSize = (width, height) => ({
  width,
  height,
  innerWidth: width - MARGIN.left - MARGIN.right,
  innerHeight: height - MARGIN.top - MARGIN.bottom
});

const formatXTick = date => d3.timeFormat(d3.timeDay(date) < date ? '%H:%M' : '%b %e')(date);

const adjustTextLabels = timeScale => (selection) => {
  const ticks = timeScale.ticks();
  const tickDistance = timeScale(ticks[ticks.length - 1]) - timeScale(ticks[ticks.length - 2]);
  selection.selectAll('text').attr('transform', `translate(${tickDistance / 2},0)`);
};

class TimeActivityGraph extends Component {
  state = {
    xScale: null,
    yScale: null,
    zoomScale: 1,
    selectedFile: null,
    size: {
      width: WIDTH,
      height: HEIGHT,
      innerWidth: INNER_WIDTH,
      innerHeight: INNER_HEIGHT
    }
  };

  componentDidMount() {
    this.init();
    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentWillReceiveProps() {
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  setNode = (name, node) => {
    this.nodes[name] = node;
  };

  getPanExtent() {
    const { innerWidth, innerHeight } = this.state.size;
    return [[-100, -0.5], [innerWidth + 100, innerHeight + 0.5]];
  }

  xAxis = null;
  yAxis = null;
  nodes = {
    container: null,
    xAxis: null,
    yAxis: null
  };

  handleResize() {
    const { offsetWidth, offsetHeight } = this.nodes.container;
    const size = calculateSize(offsetWidth, offsetHeight);
    this.setState({ size }, this.redrawGraph);
  }

  redrawGraph() {
    const { innerWidth, innerHeight } = this.state.size;
    const { xScale, yScale } = this.state;
    xScale.range([0, innerWidth]);
    yScale.range([innerHeight, 0]);

    this.setState({ xScale, yScale }, () => {
      this.updateXAxis();
      this.updateYAxis();
      this.updateZoom();
    });
  }

  init() {
    // set the ranges
    const { innerWidth, innerHeight } = this.state.size;
    const xScale = d3.scaleTime().range([0, innerWidth]);
    const yScale = d3.scaleTime().range([innerHeight, 0]);

    // Scale the range of the data
    xScale.domain([
      moment(d3.min(this.props.files, d => d.date)).subtract(1, 'days'),
      moment(d3.max(this.props.files, d => d.date)).add(1, 'day')
    ]);
    yScale.domain([moment().endOf('day'), moment().startOf('day')]);

    this.setState({ xScale, yScale }, () => {
      this.updateInteractiveView();
      this.updateXAxis();
      this.updateYAxis();
    });
  }

  updateInteractiveView() {
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 120])
      .translateExtent(this.getPanExtent())
      .on('zoom', this.handleZoom);
    d3.select(this.nodes.view).call(this.zoom);
  }

  updateXAxis() {
    this.xAxis = d3
      .axisBottom(this.state.xScale)
      .tickSize(-this.state.size.innerHeight)
      .tickFormat(formatXTick)
      .tickPadding(10);
    d3.select(this.nodes.xAxis)
      .call(this.xAxis)
      .call(adjustTextLabels(this.state.xScale));
  }

  updateYAxis() {
    this.yAxis = d3
      .axisLeft(this.state.yScale)
      .tickFormat(d3.timeFormat('%H:%M'));
    d3.select(this.nodes.yAxis).call(this.yAxis);
  }

  updateZoom() {
    this.zoom.translateExtent(this.getPanExtent());
    d3.select(this.nodes.view).call(this.zoom);

    const transform = d3.zoomTransform(this.nodes.view);
    const xRescale = transform.rescaleX(this.state.xScale);
    d3.select(this.nodes.yAxis)
      .call(this.yAxis.scale(transform.rescaleY(this.state.yScale)));
    d3.select(this.nodes.xAxis)
      .call(this.xAxis.scale(xRescale))
      .call(adjustTextLabels(xRescale));
  }

  handleZoom = () => {
    const transform = d3.zoomTransform(this.nodes.view);
    const xRescale = transform.rescaleX(this.state.xScale);
    const { x, y, k } = transform;
    this.setState({ zoomScale: k });

    d3.select(this.nodes.dataContainer)
      .attr('transform', `translate(${x}, ${y}) scale(${k})`);
    d3.select(this.nodes.xAxis)
      .call(this.xAxis.scale(xRescale))
      .call(adjustTextLabels(xRescale));
    d3.select(this.nodes.yAxis)
      .call(this.yAxis.scale(transform.rescaleY(this.state.yScale)));
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
    const { xScale, yScale, zoomScale, selectedFile } = this.state;
    if (!xScale || !yScale) return null;

    return this.props.files.map(file => (
      <DataPoint
        file={file}
        key={file.fileId}
        x={xScale(file.date)}
        y={yScale(file.time)}
        radius={DOT_RADIUS / zoomScale}
        borderWidth={1 / zoomScale}
        visible={selectedFile === file.fileId}
        onVisibleChange={visible => this.setState({
          selectedFile: visible ? file.fileId : null
        })}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      />
    ));
  }

  render() {
    const { width, height, innerWidth, innerHeight } = this.state.size;

    return (
      <div ref={node => this.setNode('container', node)} className="TimeActivityGraph">
        <svg ref={node => this.setNode('graph', node)} className="TimeActivityGraph__graph" width={width} height={height}>
          <defs>
            <clipPath id="clip">
              <rect id="clip-rect" x={0} y={0} width={innerWidth} height={innerHeight} />
            </clipPath>
          </defs>
          <g
            ref={node => this.setNode('xAxis', node)}
            className="TimeActivityGraph__axis TimeActivityGraph__x-axis"
            transform={`translate(0,${innerHeight})`}
          />
          <g
            ref={node => this.setNode('yAxis', node)}
            className="TimeActivityGraph__axis TimeActivityGraph__y-axis"
          />
          <g clipPath="url(#clip)">
            <rect
              ref={node => this.setNode('view', node)}
              className="TimeActivityGraph__view"
              x={0}
              y={0}
              width={innerWidth}
              height={innerHeight}
              onClick={() => this.setState({ selectedFile: null })}
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
