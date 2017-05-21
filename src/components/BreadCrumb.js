import React from 'react';
import { Breadcrumb } from 'react-bootstrap/lib';

const BreadCrumb = ({items}) => {  //items is array of objects [{ term : link },{},...]
	
	const subs = [];
	 items.map((item,i) => {
	 	let value;
	 	let k;
	 	for (var key in item) {
	 		value = item[key];
	 		k = key;
	 	}
	 	if (item === items[items.length-1]) subs.push(<Breadcrumb.Item href={value} key={i} className="teamroom-body-nav-link breadcrumb-active" active>{k.toUpperCase()}</Breadcrumb.Item>)
	 	else subs.push(<Breadcrumb.Item href={value} key={i} className="teamroom-body-nav-link"><span className="breadcrumb-passive">{k.toUpperCase()}</span></Breadcrumb.Item>)

	 })

		
	
	return (
		<div className="row teamroom-body-nav">
			<Breadcrumb className="teamroom-body-nav-links clearpadding">
				{subs}		
			</Breadcrumb>
		</div>
  	)
}

export default BreadCrumb;


