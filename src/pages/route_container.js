import React from 'react';
import { Component } from 'react';

export default class Habla extends Component {
	render() {
		return (
			<div className="container-fluid">
				{this.props.children}
			</div>
		);
	}
}