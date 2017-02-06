import React from 'react';

//This should be in Class module when we have a 
//transfer state for Create Team
const HeaderFastRegister = () => {
	return (
		<div className="fast-register">
	    	<div className="register-first">
				<div className="col-xs-6">
					<input className="form-control" type="email" placeholder="Email address" />
				</div>
				<a href="#" className="btn create-new-team">
					Create New Team
				</a>
	    	</div>
	    	
	    	<div className="register-second">
				<p>Already using Habla?
				<a href="#"> Sign in </a> 
				or 
				<a href="#"> find your team</a>
				</p>
	    	</div>
	    </div>
	);
}

export default HeaderFastRegister;
