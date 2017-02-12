import React from 'react';
import Habla from '../../habla.js';
import { Link } from 'react-router';
import Form from 'react-bootstrap/lib/Form';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const TeamHeader = () => {
	return (
		<div className="row header-login">
			<div className="col-md-1">
				<Link to="/">
					<img className="logo-login" src='/resources/img/logo.png' />
				</Link>
			</div>
			<div className="col-md-6 col-md-offset-2 team-search">
				<FormGroup>
					<InputGroup>
						<DropdownButton
							componentClass={InputGroup.Button}
							id="search-type"
							title="Contextual"
						>
							<MenuItem key="1">Type 1</MenuItem>
							<MenuItem key="2">Type 2</MenuItem>
						</DropdownButton>
						<FormControl 
							type="text" 
							placeholder="Search"
						/>
						<InputGroup.Button>
							<Button
								type="submit"
								className="search-button"
							>
								<i className="ion-ios-search-strong"></i>
							</Button>
						</InputGroup.Button>
					</InputGroup>
				</FormGroup>
			</div>

			<div className="col-md-3 team-header-icons">
				<i className="ion-chatbubbles"></i>
				<i className="ion-ios-calendar-outline"></i>
				<i className="ion-earth"></i>
				<i className="ion-ios-gear"></i>
				<i className="ion-help-circled team-question-icon"></i>

				
			</div>

		</div>
	);
}

export default TeamHeader;