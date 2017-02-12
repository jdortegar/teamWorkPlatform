import React from 'react';
import TeamHeader from './components/teamheader';
import TeamBody from './components/teambody';

const Team = () => {
	return (
		<div className="container-fluid">
			<TeamHeader />
			<TeamBody />
		</div>
	);
}

export default Team;