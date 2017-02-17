import React from 'react';
import { Link } from 'react-router';
import TeamPost from './team-post';

const BodyMiddle = () => {
	return (
		<div className="col-md-5 body-middle">
			<div className="team-middle-header">
				<div className="row">
					<div className="col-md-4">
						<h3>Team Feed</h3>
					</div>
					<div className="col-md-4 team-middle-header-middle">
						<p className="inline-block team-middle-header-middle-text">
							Most Recent
						</p>
						<div className="inline-block">
							<i className="fa fa-angle-down"></i>
						</div>
					</div>
					<div className="col-md-4 team-middle-header-right">
						<p>
							94 Updates
						</p>
					</div>
				</div>
			</div>
{/* start of package */}

			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />
			<TeamPost />

{/* end of package */}

		</div>
	);
}

export default BodyMiddle;