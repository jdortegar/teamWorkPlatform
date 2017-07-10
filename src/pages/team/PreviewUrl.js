import React, { Component } from 'react';
import { FieldGroup } from '../../components';
import Metascraper from 'metascraper';
import axios from 'axios';
// import opengraph from 'opengraph-io';

class PreviewUrl extends Component {

	constructor(props) {
		super(props);
		// this.state = {
		// 	input: '', 
		// 	url: '', 
		// 	words: 1000, 
		// 	urlSend: '', 
		// 	description: '',
		// 	title: '',
		// 	metaUrl: '',
		// 	favicon: '',
		// 	image: '',
		// };
		this.state = {
			input: '', 
			url: '', 
			words: 1000, 
			urlSend: '', 
			description: 'Unforgettable trips start with Airbnb. Find adventures nearby or in faraway places and access unique homes, experiences, and places around the world.',
			title: 'Vacation Rentals, Homes, Experiences & Places - Airbnb',
			metaUrl: 'https://www.airbnb.com',
			favicon: 'https://a0.muscache.com/airbnb/static/icons/android-icon-192x192-c0465f9f0380893768972a31a614b670.png',
			siteName: 'Airbnb',
			image: 'https://a0.muscache.com/airbnb/static/logos/trips-og-1280x630-9de9c338cc3fd9b5663fb80be0cbe8c2.jpg',
		};
		this.previewUrl = this.previewUrl.bind(this);
		this.filterUrl = this.filterUrl.bind(this);
	}

	handleInput(input){
		this.setState({input});
	}

	filterUrl(rawUrl) {

		let finalUrl = '';
		if (rawUrl && rawUrl.length > 0) {
			let head = 0;
			let tail = rawUrl.length;
			for (const c of rawUrl) {
				if (c.toLowerCase() == c.toUpperCase()) head++;
				else break;
			}

			for (let i = rawUrl.length-1; i>0; i--) {
				const charTail = rawUrl.charAt(i);
				if (charTail.toLowerCase() == charTail.toUpperCase()) tail--;
				else break;
			}
			finalUrl = rawUrl.substring(head, tail);
		}
		return finalUrl;
	}

	getMetaData(url) {
		if (url) {
			axios.get(url)
			.then(meta => console.log(meta))
			

			//error when meta.data.error.message = The provided url could not be found.  Please ensure it is valid and properly encoded.
			//correct : meta.data no error property
		}
	}

	getUrl() {

		if (this.state.input != '') {
			const splitWords = this.state.input.split(' ');
			const inputWords = splitWords.map(word => {
				return this.filterUrl(word);
			});
			console.log(inputWords);
			let wwwInit = inputWords.find(word => {
				return word.substring(0,3) == "www" ? word : '';
			})
			// console.log(wwwInit);
			let httpInit = '' || inputWords.find(word => {
				return word.substring(0,4) == "http" ? word : '';
			})
			const rawUrl = wwwInit == undefined ? (httpInit == undefined ? '' : httpInit) : "http://"+wwwInit;
			// console.log(rawUrl);
			this.state.url = rawUrl;
			// if (this.state.url != '') {
			// 	console.log("Capturing");
			// 	if (inputWords.length > this.state.words) this.state.urlSend = rawUrl;
			// 	this.state.words = inputWords.length;
			// }
			console.log("FINAL URL: "+this.state.urlSend);
			return rawUrl;
		}
		return;
	}



	previewUrl() {
		const apiUrl = "https://opengraph.io/api/1.0/site/";
		const encodedUrl = encodeURIComponent("https://www.airbnb.com");
		const apiKey = "?app_id=5962afe907efcb0b00a6cf49";
		// this.getUrl();
		// const metaData = this.getMetaData(apiUrl+encodedUrl+apiKey);
		return (
			<div className="center">
				<div className="row">
					<div className="col-md-6">
						<img src={this.state.favicon} style={{width: "20px", height: "20px"}}/>
						<span style={{color: "grey", fontSize: "20px"}}>{this.state.siteName}</span>
						<div style={{}}>
							<a href={this.state.metaUrl} className="blue-link"> {this.state.title}</a>
						</div>
						<div>
							{this.state.description}
						</div>
					</div>
					<div className="col-md-6">
						<img src={this.state.image} style={{width: "100px", height: "100px", borderRadius: "5px"}} />
					</div>
				</div>

			</div>
		)
	}

	render() {
		return (
			<div>
				<div className="row">
					<form>
						<div className="col-md-4 col-md-offset-4">
							<FieldGroup
								onChange={event => this.handleInput(event.target.value)}
								className="col-md-12"
							/>
						</div>
					</form>
				</div>
			
				<div className="row">
					{this.previewUrl()}
				</div>
			</div>
		)
	}
}

export default PreviewUrl;