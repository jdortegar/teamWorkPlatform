import React from 'react';

const ShortName = (fullname) => {
	var arrayName = fullname.split(' ');
	return arrayName[0].charAt(0)+arrayName[arrayName.length-1].charAt(0);
}

export default ShortName;