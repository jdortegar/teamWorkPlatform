import React from 'react';

const TeamMember = () => {
	return (
		<div className="row team-member">
			<div className="col-md-2 team-member-avatar-container">
				<img src="/resources/img/tho.jpg" className="team-member-avatar" />
			</div>
			<div className="col-md-10 member-message-time">
				<div className="message-time">
					05:16AM
				</div>
				<div className="member-message">
					Freelance Design Tricks How To Get Away With Murder In The Workplace
				</div>
			</div>
		</div>
	);
}

export default TeamMember;