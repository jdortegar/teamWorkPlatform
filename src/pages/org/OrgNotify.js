import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Header, Footer } from '../../components';






class OrgNotify extends Component {

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
							<h1> Your Org is Updated! </h1>
						</div>
						<p>
							Your org is viewable by its members
						</p>
						<form>
	 						<br />
							<div className="row">
								<Link to="/org-notify">
									<Button
										type="submit"
										bsStyle="primary"
										className="col-md-12" >
											I AM DONE
									</Button>
								</Link>
							</div>
							<br />


							<div className="row">
								<Link to="/org-profile">
									<Button
										type="submit"
										className="col-md-12" >
											CONTINUE EDITING
									</Button>
								</Link>
							</div>

							<div className="row">
								<Link to="/org-profile">
									<p className="notify-link">
									VIEW YOUR PROFILE AS OTHERS SEEE IT
									</p>
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

export default OrgNotify;
