import React from 'react';

const Spinning = (classname) => {
	const name = "spinning "+classname.classname;
	return (
		<span className={name} >
			<img src="https://c2.staticflickr.com/4/3955/33078312014_f6f8c759db_o.png" className="spinning-logo" />
			
			<div className="pulse" />
			
		</span>
	)
}

export default Spinning;