import React, { Component } from 'react';
import {
  VictoryLabel,
  VictoryTooltip
} from 'victory';

export default class CustomLabel extends Component {
  static defaultEvents = VictoryTooltip.defaultEvents;

  render() {
    const { data, index } = this.props;
    const link = data[index].resourceUri;
    return (
      <g>
        <VictoryLabel
          {...this.props}
          events={{
            onClick: () => {
              window.open(link, '_blank');
            }
          }}
          style={{ fill: 'none' }}
          text={link}
          dy={-27}
        />
        <VictoryTooltip
          {...this.props}
          style={[{}, {}, {}, { fill: 'blue' }]} // one object per <tspan/>
        />
      </g>
    );
  }
}
