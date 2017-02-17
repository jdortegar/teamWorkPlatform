import React from 'react';
import { Link } from 'react-router';
import TeamMember from './team-member';

const BodyLeft = () => {
	return (
		<div className="col-md-3 body-left">
			<div className="mainuser">
				<div className="row">
					<div className="col-md-2 mainuser-avatar-container">
						<img src="/resources/img/tho.jpg" className="mainuser-avatar" />
					</div>
					<div className="col-md-10 mainuser-info">
						<div className="mainuser-name">
							<p>Tho Truong</p>
						</div>
						<div className="mainuser-email">
							tho.truong@habla.io
						</div>
						<div className="mainuser-phone">
							408-427-2150
						</div>
					</div>
				</div>
			</div>

			<div>Relevant messages</div>
			<br/>

			<div className="team-members">

				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />
				<TeamMember />


			</div>

			<div className="team-nav-bottom">
				<div className="row">
					<div className="col-md-2 nav-horizontal">
						<div className="row">
							<div className="nav-horizontal-icon-container">
								<i className="fa fa-user-o"></i>
							</div>
							<div className="nav-horizontal-icon-container">
								<i className="fa fa-bar-chart"></i>
							</div>
							<div className="nav-horizontal-icon-container">
								<i className="fa fa-search"></i>
							</div>
							<div className="nav-horizontal-icon-container">
								<i className="fa fa-star-o"></i>
							</div>
						</div>	
					</div>


					<div className="col-md-10 thin-text">
						<div className="">
							Teams
						</div>
						<div className="team-nav-links">
							<Link to="/">UK Sales</Link>
						</div>
						<div className="team-nav-links">
							<Link to="/">UK Marketting</Link>
						</div>
						<div className="team-nav-links">
							<Link to="/">Program Epsilon</Link>
						</div>
						<div className="team-nav-links-indent">
							<Link to="/">Weekly Standup</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Michael Stokes</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Inez Dennis</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Bertie Wade</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Jayden Fuller</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Alberta Sharp</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Robert Bridges</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Anne Douglas</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Kate Rice</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Norman Delgado</Link>
						</div>
						<div className="team-nav-links-indent-indent">
							<Link to="/">Lettie Steele</Link>
						</div>
					</div>
				</div>
			</div>

		</div>

	);
}

export default BodyLeft;