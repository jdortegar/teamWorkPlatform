/** This extends Highcharts like described in the docs: https://www.highcharts.com/docs/extending-highcharts/extending-highcharts
 * The panning function supports only horizontal panning officially, but it handles xy panning in the code as well.
 * This extension copies the original code from their github and adapts it to add extra padding while panning (not supported):
 *   https://github.com/highcharts/highcharts/blob/670b3b24158e250ec368315e9493f5b546d8e6e5/js/parts/Interaction.js#L509
 */

export default H =>
  H.wrap(H.Chart.prototype, 'pan', function handleYPan(proceed, e, panning) {
    // If you want to apply the original function with the original arguments
    // proceed.apply(this, [e, panning]);

    let doRedraw = false;
    const chart = this;
    const { hoverPoints } = chart;

    H.fireEvent(this, 'pan', { originalEvent: e }, () => {
      if (hoverPoints) {
        hoverPoints.forEach(point => point.setState());
      }

      (panning === 'xy' ? [1, 0] : [1]).forEach(isX => {
        const axis = chart[isX ? 'xAxis' : 'yAxis'][0];
        const { horiz } = axis;
        const mousePos = e[horiz ? 'chartX' : 'chartY'];
        const mouseDown = horiz ? 'mouseDownX' : 'mouseDownY';
        const startPos = chart[mouseDown];
        const halfPointRange = (axis.pointRange || 0) / 2;
        const pointRangeDirection = (axis.reversed && !chart.inverted) || (!axis.reversed && chart.inverted) ? -1 : 1;
        const extremes = axis.getExtremes();
        const panMin = axis.toValue(startPos - mousePos, true) + halfPointRange * pointRangeDirection;
        const panMax = axis.toValue(startPos + axis.len - mousePos, true) - halfPointRange * pointRangeDirection;
        const flipped = panMax < panMin;

        let newMin = flipped ? panMax : panMin;
        let newMax = flipped ? panMin : panMax;

        // ADDED: This padding is added by the Habla team to give some extra spacing to the graph view.
        // Originally, the graph only allows panning up to the last data point.
        const PADDING = 0.1;
        const length = newMax - newMin;

        const paddedMin = Math.min(
          extremes.dataMin - length * PADDING,
          halfPointRange ? extremes.min : axis.toValue(axis.toPixels(extremes.min) - axis.minPixelPadding)
        );

        const paddedMax = Math.max(
          extremes.dataMax + length * PADDING,
          halfPointRange ? extremes.max : axis.toValue(axis.toPixels(extremes.max) + axis.minPixelPadding)
        );

        // If the new range spills over, either to the min or max, adjust the new range.
        let spill;

        spill = paddedMin - newMin;
        if (spill > 0) {
          newMax += spill;
          newMin = paddedMin;
        }
        spill = newMax - paddedMax;
        if (spill > 0) {
          newMax = paddedMax;
          newMin -= spill;
        }

        // Set new extremes if they are actually new
        if (axis.series.length && newMin !== extremes.min && newMax !== extremes.max) {
          axis.setExtremes(newMin, newMax, false, false, { trigger: 'pan' });
          doRedraw = true;
        }

        chart[mouseDown] = mousePos; // set new reference for next run
      });

      if (doRedraw) {
        chart.redraw(false);
      }
      H.css(chart.container, { cursor: 'move' });
    });
  });
