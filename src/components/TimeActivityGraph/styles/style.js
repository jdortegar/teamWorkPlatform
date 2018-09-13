const BACKGROUND_COLOR = '#557dbf';
const LINE_COLOR = '#dddddd';
const LINE_OPACITY = 0.4;

const tickLabels = {
  fill: LINE_COLOR,
  fillOpacity: LINE_OPACITY,
  fontFamily: 'Lato, sans-serif',
  textTransform: 'uppercase'
};

export default {
  container: {
    parent: {
      backgroundColor: BACKGROUND_COLOR
    }
  },
  chart: {
    padding: {
      top: 0,
      right: 10,
      left: 70,
      bottom: 70
    }
  },
  scatter: {
    data: {
      fill: d => d.color,
      stroke: '#ffffff',
      strokeWidth: 1
    }
  },
  tickLabels,
  compoundTickLabels: [tickLabels, { ...tickLabels, fillOpacity: 0.7 }],
  axisLabel: {
    ...tickLabels,
    letterSpacing: 10
  },
  lines: {
    stroke: LINE_COLOR,
    strokeOpacity: LINE_OPACITY
  },
  hidden: {
    stroke: 'none'
  }
};
