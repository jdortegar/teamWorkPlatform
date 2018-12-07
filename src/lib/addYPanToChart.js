export default H =>
  H.wrap(H.Chart.prototype, 'pan', function handleYPan(proceed, event, ...args) {
    // Apply the original function with the original arguments
    proceed.apply(this, [event, ...args]);

    let doRedraw = false;
    const chart = this;

    // remove active points for shared tooltip
    const { hoverPoints } = chart;
    if (hoverPoints) {
      H.each(hoverPoints, point => point.setState());
    }

    const mousePosX = event.chartX;
    const mousePosY = event.chartY;
    const xAxis = chart.xAxis[0];
    const yAxis = chart.yAxis[0];
    const startPosX = chart.mouseDownX;
    const startPosY = chart.mouseDownY;
    const halfPointRangeX = (xAxis.pointRange || 0) / 2;
    const halfPointRangeY = (yAxis.pointRange || 0) / 2;
    const extremesX = xAxis.getExtremes();
    const newMinX = xAxis.toValue(startPosX - mousePosX, true) + halfPointRangeX;
    const newMaxX = xAxis.toValue(startPosX + chart.plotWidth - mousePosX, true) - halfPointRangeX;
    const extremesY = chart.yAxisExtremes || yAxis.getExtremes();
    const newMaxY = yAxis.toValue(startPosY - mousePosY, true) + halfPointRangeY;
    const newMinY = yAxis.toValue(startPosY + chart.plotHeight - mousePosY, true) - halfPointRangeY;

    if (
      xAxis.series.length &&
      newMinX > Math.min(extremesX.dataMin, extremesX.min) &&
      newMaxX < Math.max(extremesX.dataMax, extremesX.max) &&
      newMinY > Math.min(extremesY.dataMin, extremesY.min) &&
      newMaxY < Math.max(extremesY.dataMax, extremesY.max)
    ) {
      xAxis.setExtremes(newMinX, newMaxX, false, false, { trigger: 'pan' });
      yAxis.setExtremes(newMinY, newMaxY, false, false, { trigger: 'pan' });
      doRedraw = true;
    }

    // set new reference for next run
    chart.mouseDownX = mousePosX;
    chart.mouseDownY = mousePosY;

    if (doRedraw) chart.redraw(false);
  });
