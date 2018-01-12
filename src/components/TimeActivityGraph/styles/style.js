const BACKGROUND_COLOR = '#557dbf';
const LINE_COLOR = '#dddddd';
const LINE_OPACITY = 0.4;

export default {
  container: {
    width: 1050,
    height: 700,
    padding: {
      top: 10,
      right: 10,
      left: 70,
      bottom: 70
    },
    parent: {
      backgroundColor: BACKGROUND_COLOR
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
