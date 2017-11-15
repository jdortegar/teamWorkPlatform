import React from 'react';
import moment from 'moment';
import * as d3 from 'd3';

import TimeActivityGraph from '../../components/TimeActivityGraph';
import dataFile from './data.json';

const convertISODate = strISODate => moment(strISODate).format('YYYY/MM/DD HH:mm:ss');
const parseDateTime = strISODate => d3.timeParse('%Y/%m/%d %H:%M:%S')(convertISODate(strISODate));
const formatTime = (strISODate, format = '%H:%M:%S') => d3.timeFormat(format)(parseDateTime(strISODate));
const getColorByType = (type, fileTypes) => fileTypes.find(({ fileType }) => fileType === type).color;

const buildDataObject = (file, fileTypes) => ({
  ...file,
  date: moment(file.lastModified).startOf('day'),
  time: moment.duration(formatTime(file.lastModified)).asHours(),
  displayTime: formatTime(file.lastModified, '%X'),
  color: getColorByType(file.fileType, fileTypes)
});

const CKGPage = () => {
  const { files, fileTypes } = dataFile.message;
  return <TimeActivityGraph files={files.map(file => buildDataObject(file, fileTypes))} />;
};

export default CKGPage;
