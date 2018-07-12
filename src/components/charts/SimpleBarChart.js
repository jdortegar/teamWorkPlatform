import React from 'react';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';

class SimpleBarChart extends React.Component {
  componentDidMount() {
    if (this.props.modules) {
      this.props.modules.forEach(module => {
        module(Highcharts);
      });
    }
    this.chart = new Highcharts[this.props.type || 'Chart'](this.props.container, this.props.options);
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return React.createElement('div', { id: this.props.container });
  }
}

SimpleBarChart.defaultProps = {
  modules: null,
  container: null,
  type: 'Chart'
};

SimpleBarChart.propTypes = {
  modules: PropTypes.array,
  container: PropTypes.object,
  options: PropTypes.object.isRequired,
  type: PropTypes.string
};

export default SimpleBarChart;
