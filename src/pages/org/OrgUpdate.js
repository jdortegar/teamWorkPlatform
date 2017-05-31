import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Footer, FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';






class OrgUpdate extends Component {

	constructor(props) {
		super(props);
		this.state = {term: ''};
	}

	handleChange(term) {
		this.setState({term});

		// Todo: Implement Autocomplete function
	}

	render() {
		const country = this.state.country;
		return (
			<div className="container-fluid">
				<LoggedHeader />
				<section>
				<div className="row">
					<div className="col-md-4 col-md-offset-4 ">
						<div className="header">
							<h1> Your Organization </h1>
						</div>

						<form>
							<div className="center">
								<div className="preview-image">
									<i className="fa fa-user" />
								</div>
								<input className="file-input"
									type="file"
									 />

								<button className="btn btn-large"
									type="button"
									 >Upload</button>

							</div>
							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									label="Org Name"
									placeholder="bjones_org"
									className="col-md-12"
								/>
							</div>

							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									label="Web Address"
									placeholder="www.bjones.com"
									className="col-md-12"
								/>
							</div>



	 						<br />
							<div className="row">
								<Link to="/org-notify">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12" >
											UPDATE ORG
									</Button>
								</Link>
							</div>
							<br />


							<div className="row">
								<Link to="/org-profile">
									<Button
										type="submit"
										className="col-md-12" >
											MANAGE YOUR PROFILE
									</Button>
								</Link>
							</div>
						</form>
						<div className="fill-vertical">
						</div>
					</div>
				</div>
				</section>
				<Footer />
			</div>
		);
	}
}

export default OrgUpdate;
