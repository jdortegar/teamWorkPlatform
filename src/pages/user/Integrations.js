import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Link } from 'react-router';
import { Footer, FieldGroup } from '../../components';
import LoggedHeader from '../../components/LoggedHeader';
import { connect } from 'react-redux';
import helper from '../../components/Helper';

class Integrations extends Component {

	handleGoogleDrive() {
		console.log("GOOGLE DRIVE ICON CLICKED");
		helper.callGoogleDriveApi()
		.then(result => {})
		.catch(error => {})
	}

	handleBox() {
		console.log("BOX ICON CLICKED");
		helper.callBoxApi()
		.then(result => {})
		.catch(error => {})
	}

	render() {
		return (
			<div>
				<LoggedHeader />
				<section>

					<div className="row">
						<div className="col-md-12">
							<div className="header">
								<h1> Integrations </h1>
							</div>
							<div className="center">
								<img onClick={() => this.handleGoogleDrive() } src="https://c1.staticflickr.com/5/4240/35080287162_0d6aef000a_o.png" style={{width: "200px", height: "200px"}} />
								<br />
								<img onClick={() => this.handleBox() } src="https://c1.staticflickr.com/5/4220/34858435850_3ff5486f73_o.png" style={{width: "200px", height: "200px"}} />
							</div>
						</div>
					</div>
				</section>
				<Footer />
			</div>
		)
	}
}

export default Integrations;

// [url=https://flic.kr/p/VrVDch][img]https://c1.staticflickr.com/5/4240/35080287162_0d6aef000a_o.png[/img][/url][url=https://flic.kr/p/VrVDch]googledrive[/url] by [url=https://www.flickr.com/photos/thotruong/]Tho Truong[/url], on Flickr
// [url=https://flic.kr/p/V7jAwE][img]https://c1.staticflickr.com/5/4220/34858435850_3ff5486f73_o.png[/img][/url][url=https://flic.kr/p/V7jAwE]box[/url] by [url=https://www.flickr.com/photos/thotruong/]Tho Truong[/url], on Flickr