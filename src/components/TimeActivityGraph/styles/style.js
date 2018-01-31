const BACKGROUND_COLOR = '#557dbf';
const LINE_COLOR = '#dddddd';
const LINE_OPACITY = 0.4;

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
      bottom: 50
    }
  },
  scatter: {
    data: {
      fill: d => d.color,
      stroke: '#ffffff',
      strokeWidth: 1
    }
  },
  tickLabels: {
    fill: LINE_COLOR,
    fillOpacity: LINE_OPACITY,
    fontFamily: 'Lato, sans-serif',
    textTransform: 'uppercase'
  },
  lines: {
    stroke: LINE_COLOR,
    strokeOpacity: LINE_OPACITY
  },
  hidden: {
    stroke: 'none'
  }
};
