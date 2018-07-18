const BACKGROUND_COLOR = '#557dbf';
const LINE_COLOR = '#dddddd';
const LINE_OPACITY = 0.4;

export const COLORS = [
  '#ffb2ad',
  '#97e3b0',
  '#6fa8f9',
  '#edf25e',
  '#efb250',
  '#48cac6',
  '#ff9053',
  '#43f5ba',
  '#23cf5f'
];

const tickLabels = {
  fill: LINE_COLOR,
  fillOpacity: LINE_OPACITY,
  fontFamily: 'Lato, sans-serif',
  textTransform: 'uppercase'
};

const styles = {
  container: {
    parent: {
      backgroundColor: BACKGROUND_COLOR
    }
  },
  tickLabels,
  smallTickLabels: {
    ...tickLabels,
    fontSize: 11
  },
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

export default styles;
