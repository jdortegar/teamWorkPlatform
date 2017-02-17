import React from 'react';
import { Link } from 'react-router';

const TeamPost = ({src, name, email, title, content}) => {
	return (
		<div className="team-middle-post">
				<div className="row">
					<div className="col-md-1">
						<img src="/resources/img/tho.jpg" className="team-member-avatar" />
					</div>
					<div className="col-md-11">
						<div className="team-user-name">
							Tho Truong
						</div>
						<div className="team-user-email">
							tho.truong@habla.io
						</div>
						<div className="team-user-message-title">
							<p> Why Use External It Support</p>
						</div>
						<div className="team-user-message-content">
							<p>
								Accessories Here you can find 
								the best computer accessorty for your
								laptop, monitor, printer, scanner, speaker, 
								projector, hardware and more. Accessories Here you can find 
								the best computer accessorty for your
								laptop, monitor, printer, scanner, speaker, 
								projector, hardware and more. 
							</p>
						</div>
						<div className="row">
							<div className="col-md-4">
								<Link to="/">
									<i className="fa fa-thumbs-o-up">&nbsp;Like</i>
								</Link>
							</div>
							<div className="col-md-4">
								<Link to="/">
									<i className="fa fa-comment-o">&nbsp;Comment</i>
								</Link>
							</div>
							<div className="col-md-4">
								<Link to="/">
									<i className="fa fa-share-square-o">&nbsp;Share</i>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
	);
}

export default TeamPost;