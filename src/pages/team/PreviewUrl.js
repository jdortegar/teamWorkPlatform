import React, { Component } from 'react';
import { FieldGroup } from '../../components';
import axios from 'axios'
class PreviewUrl extends Component {

	constructor(props) {
		super(props);
		this.state = {
			input: '', 
			url: '', 
			description: '',
			title: '',
			metaUrl: '',
			favicon: '',
			image: '',
			content: '',
			border: "none",
		};
		this.previewUrl = this.previewUrl.bind(this);
		this.filterUrl = this.filterUrl.bind(this);
	}

	handleInput(input){
		this.state.input = input;
		this.previewUrl();
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
			.then(meta => {
				console.log(meta);
				const data = meta.data.hybridGraph;
				if (!meta.data.hasOwnProperty("error")) {
					this.state.description = data.hasOwnProperty("description") ? data.description : '';
					this.state.title = data.hasOwnProperty("title") ? data.title : '';
					this.state.metaUrl = data.hasOwnProperty("url") ? data.url : '';
					this.state.favicon = data.hasOwnProperty("favicon") ? data.favicon : '';
					this.state.image = data.hasOwnProperty("image") ? data.image : '';
					this.state.siteName = data.hasOwnProperty("site_name") ? data.site_name : '';
					this.state.border = "2px solid #e6e6e6";
					this.state.content = (
						<div>
							<div >
								<div className="web-item" style={{marginTop: "20px", width: "400px", textAlign: "left"}}>
									<div className="web-item" style={{}}>
										<img src={this.state.favicon} style={{width: "20px", height: "20px", marginBottom: "10px"}}/>
									</div>
									<div className="web-item" style={{color: "grey", fontSize: "20px", paddingLeft: "5px", marginTop: "5px"}}>
										{this.state.siteName}
									</div>
									<div style={{fontSize: "16px", fontWeight: "bold"}}>
										<a href={this.state.metaUrl} className="blue-link-underline"> {this.state.title}</a>
									</div>
									<div style={{fontSize: "16px"}}>
										{this.state.description}
									</div>
								</div>
								<div className="web-item" style={{height: "100%"}}>
									<img src={this.state.image} style={{width: "100px", borderRadius: "5px", marginBottom: "80px", marginLeft: "25px"}} />
								</div>
							</div>

						</div>
					)
					this.forceUpdate();
				}
				else {
					this.setState({
						url: '', 
						description: '',
						title: '',
						metaUrl: '',
						favicon: '',
						image: '',
						content: '',
						border: 'none',
					})
				}
			})
		}
	}

	getUrl() {

		if (this.state.input != '') {
			const splitWords = this.state.input.split(' ');
			const inputWords = splitWords.map(word => {
				return this.filterUrl(word);
			});
			let wwwInit = inputWords.find(word => {
				return word.substring(0,3) == "www" ? word : '';
			})
			
			let httpInit = '' || inputWords.find(word => {
				return word.substring(0,4) == "http" ? word : '';
			})
			const rawUrl = wwwInit == undefined ? (httpInit == undefined ? '' : httpInit) : "http://"+wwwInit;
			
			this.state.url = rawUrl;
			return rawUrl;
		}
		return;
	}



	previewUrl() {
		const apiUrl = "https://opengraph.io/api/1.0/site/";
		const encodedUrl = encodeURIComponent(this.getUrl());
		const apiKey = "?app_id=5962afe907efcb0b00a6cf49";
		return this.getMetaData(apiUrl+encodedUrl+apiKey);
	}

	render() {
		const bd = this.state.border;
		return (
			<div>
				<div>
					<h3> PREVIEW URL </h3>
				</div>
				<div className="row" style={{marginTop: "20px"}}>
					<form>
						<div className="col-md-4 col-md-offset-4">
							<FieldGroup
								onChange={event => this.handleInput(event.target.value)}
								className="col-md-12"
							/>
						</div>
					</form>
				</div>
				<div>
					{this.state.url}
				</div>
				<div className="center" style={{marginTop: "50px", border: `${bd}`, borderRadius: "5px", width: "600px", height: "auto"}}>
					{this.state.content}
				</div>
			</div>
		)
	}
}

export default PreviewUrl;