import React from 'react';
import Graph from 'react-graph-vis';
import { Data, Events, Options } from './components';
import { Header, Footer } from '../../components';
import HeaderNavbar from '../homepage/components/header_navbar';

const CCG = () => {
	return (
		<div className="container-graph test1">
			<Graph graph={ Data() } options={ Options() } events={ Events() } style={{ width: '100%', height: '100vh' }} />
		</div>
	);
};

export default CCG;