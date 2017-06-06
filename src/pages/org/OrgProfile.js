import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Header, Footer, FieldGroup } from '../../components';

class OrgProfile extends Component {

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
				<Header />
				<section>

				<div className="row">
					<div className="col-md-4 col-md-offset-4 ">
						<div className="header">
							<h1> Your Organizations </h1>
						</div>
						<div className="clearpadding">

							<p className="normal-size clearpadding">
								Within the Hablasphere everything is organized. {'\n'}
								Here is a list of Organizations you are currently the admin for
							</p>
						</div>
						<br />
						<form>
							<div className="row">
								<FieldGroup
									type="text"
									onChange={event => this.handleChange(event.target.value)}
									placeholder="&#xf002; Filter"
									className="col-md-12 placeholder_search"
								/>
							</div>

							<div className="clearpadding">
								<hr />
								<div className="selected">
									BobJones_Organization
								</div>
								<hr />
								<div>
									Cathode_Ray_Organization
								</div>
								<hr />
								<div>
									Osboume_Computing_Organization
								</div>

							</div>


	 						<br />
							<div className="row">
								<Link to="/resetpass">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12" >
											SWITCH ORGANIZATION
									</Button>
								</Link>
							</div>
							<br />

							<div className="row">
								<Link to="/resetpass">
									<Button
										type="submit"
										bsStyle="success"
										className="col-md-12" >
											ADMIN
									</Button>
								</Link>
							</div>
							<br />

							<div className="row">
								<Link to="/org-update">
									<Button
										type="submit"
										className="col-md-12" >
											EDIT ORGANIZATION PROFILE
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

export default OrgProfile;
