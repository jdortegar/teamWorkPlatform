import React from 'react';
import { Header, Footer } from '../../components';

const AppDirectory = () => {
	return (
		<div>
			<Header />
			<section>
				<div className="header">
					<h1>Apps Directory</h1>
				</div>
				<div className="app-directory">
					<br />
					 
						<p>Habla AI CKG and GESSE Integration for Data from within G-Suite Apps / Google Drive and Box Apps 
						</p>
						<p>
							The Habla AI platform integrates with the most Fortune Enterprise used third party content / data stores via their native REST API implementations. Full consideration is given to the OAuth2 authorization framework, accomplished by querying the resource owner for the appropriate permissions. File and user metadata is harvested from these services once access is granted, and is then incorporated into the Cognitive Knowledge Graph.
						</p>
						<p>
							REST API integrations are Habla-native, and are largely custom-coded.  Key to the implementation are the Google Drive "Changes Collection" resource, and Webhooks V2, belonging to the Box API. These resources enable server long-polling, producing a dynamic picture of resource owner activity.
						</p>
						<p>
							The Habla AI GESSE(Graphically Enabled Semantic Search Engine) also makes use of the DAU(Daily Active User) metadata in our CKG and presents interactive 2D and 3D Intelligent nodal graphs to display the most relevant relationships between Knowledge Workers / Collaborators and the files and data they work on across a Team and Team Room’s Timeline. 
						</p>
						<p>
							Coupled together, the Habla AI CKG and GESSE recover 8 hours per week per collaborator making relevant data easily available 24/7.   
						</p>

				</div>
			</section>
			<Footer />
		</div>
	);
}

export default AppDirectory;