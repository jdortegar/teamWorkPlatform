import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryZoomContainer
} from 'victory';

import styles from './styles/style';
import CustomLabel from './CustomLabel';

const propTypes = {
  files: PropTypes.arrayOf(PropTypes.object)
};

const defaultProps = {
  files: []
};

// chart size
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;
const CHART_PADDING = 50;

// from the beginning of the last year until now
const DATE_DOMAIN = [moment().subtract(1, 'year').startOf('year'), moment().add(1, 'day')];
const TIME_DOMAIN = [moment().endOf('day'), moment().startOf('day')];

// one month from the last file
const defaultZoomDomain = (files) => {
  const lastFileDate = moment.max(files.map(file => file.date));
  return [moment(lastFileDate).subtract(2, 'weeks'), moment(lastFileDate).add(1, 'day')];
};

class TimeActivityGraph extends React.Component {
  state = {
    width: MIN_WIDTH,
    height: MIN_HEIGHT
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions.bind(this));
    this.updateDimensions();
  }

  container = null;

  updateDimensions() {
    if (!this.container || !this.container.parentNode) return;
    const { clientWidth, clientHeight } = this.container.parentNode;
    const width = clientWidth;
    const height = clientHeight;

    this.setState({
      width: (width < MIN_WIDTH ? MIN_WIDTH : width),
      height: (height < MIN_HEIGHT ? MIN_HEIGHT : height)
    });
  }

  render() {
    const { files } = this.props;
    return (
      <div
        ref={(node) => { this.container = node; }}
        style={{ flex: 1, minWidth: MIN_WIDTH, minHeight: MIN_HEIGHT }}
      >
        <VictoryChart
          scale={{ x: 'time', y: 'time' }}
          domain={{ x: DATE_DOMAIN, y: TIME_DOMAIN }}
          width={this.state.width - CHART_PADDING}
          height={this.state.height - CHART_PADDING}
          padding={styles.chart.padding}
          style={styles.container}
          containerComponent={
            <VictoryZoomContainer
              zoomDimension="x"
              zoomDomain={{ x: defaultZoomDomain(files) }}
            />
          }
        >
          <VictoryAxis
            style={{
              axis: styles.hidden,
              tickLabels: styles.tickLabels,
              grid: styles.lines
            }}
          />
          <VictoryAxis
            invertAxis
            dependentAxis
            tickCount={Math.floor(this.state.height / 70)}
            tickFormat={x => moment(x).format('HH:mm')}
            style={{
              axis: styles.lines,
              tickLabels: styles.tickLabels,
              grid: styles.hidden
            }}
          />
          <VictoryScatter
            labelComponent={<CustomLabel />}
            events={[{
              target: 'data',
              eventHandlers: {
                onMouseOver: () => { },
                onMouseOut: () => { },
                onClick: () => {
                  return {
                    target: 'labels',
                    mutation: () => ({ active: true })
                  };
                },
                onDoubleClick: () => {
                  return {
                    target: 'labels',
                    mutation: () => ({ active: false })
                  };
                }
              }
            }]}
            style={styles.scatter}
            size={5}
            data={files}
            x="date"
            y="time"
          />
        </VictoryChart>
      </div>
    );
  }
}

TimeActivityGraph.propTypes = propTypes;
TimeActivityGraph.defaultProps = defaultProps;

export default TimeActivityGraph;
