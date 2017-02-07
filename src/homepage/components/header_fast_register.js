import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
//This should be in Class module when we have a 
//transfer state for Create Team
const HeaderFastRegister = () => {
	return (
		<div className="fast-register">
	    	<div className="register-first">
				<div className="col-xs-6">
					<FormGroup>
						<FormControl type="email" placeholder="Email address" />
					</FormGroup>
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
