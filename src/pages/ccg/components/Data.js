import React from 'react';

const Data = () => {
	return {
		nodes: [
			{id: 1, label: 'Tho', group: 'tho'},
		    {id: 2, label: 'Files', group: 'file'},
		    {id: 3, label: 'Chat', group: 'chat'},
		    {id: 4, label: 'Team', group: 'team'},
		    {id: 5, label: 'Home Page', group: 'homepage'},
		    {id: 6, label: 'Son', group: 'son'},
		    {id: 7, label: 'Anthony', group: 'anthony'},
		    {id: 8, label: 'Caroline', group: 'caroline'},
		    {id: 9, label: 'Rob', group: 'rob'},
		    {id: 10, label: 'Thomas', group: 'thomas'},
		    {id: 11, label: 'webapp', group: 'chat'},
		    {id: 12, label: 'mobileapp', group: 'chat'},
		    {id: 13, label: 'general', group: 'chat'},
		    {id: 14, label: 'graph', group: 'chat'},
		    {id: 15, label: 'redux', group: 'chat'},
		    {id: 16, label: 'Rob', group: 'rob'},
		    {id: 17, label: 'Anthony', group: 'anthony'},
		    {id: 18, label: 'Son', group: 'son'},
		    {id: 19, label: 'Habla', group: 'habla'},
		    {id: 20, label: 'Thomas', group: 'thomas'},
		    {id: 21, label: 'Rob', group: 'rob'},
		    {id: 22, label: 'Camilo', group: 'camilo'},
		    {id: 23, label: 'Son', group: 'son'},
		    {id: 24, label: 'Saul', group: 'saul'},
		    {id: 25, label: 'Anthony', group: 'anthony'},
		    {id: 26, label: 'Mike', group: 'mike'},
		    {id: 27, label: 'Caroline', group: 'caroline'},
		    {id: 28, label: 'Shreya', group: 'shreya'},
		    {id: 29, label: 'CCG', group: 'file'},
		    {id: 30, label: 'Graph', group: 'file'},
		    {id: 31, label: 'index.html', group: 'file'},
		    {id: 32, label: 'Sass', group: 'file'},
		    {id: 33, label: 'react bootstrap', group: 'file'},
		    {id: 34, label: 'db.json', group: 'file'},
		    {id: 35, label: 'server.js', group: 'file'},
		    {id: 36, label: 'header.js', group: 'file'},
		    {id: 37, label: 'BK-EECS', group: 'team'},
		    {id: 38, label: 'Front End', group: 'team'},
		    {id: 39, label: 'Full Stack', group: 'team'},
		    {id: 40, label: 'Back End', group: 'team'},


		],
		edges: [
			{from: 1, to: 2, label: 'shared'},
		    {from: 1, to: 3, label: 'in'},
		    {from: 1, to: 4, label: 'in'},
		    {from: 2, to: 5},
		    {from: 6, to: 5},
		    {from: 7, to: 5},
		    {from: 8, to: 5},
		    {from: 9, to: 5},
		    {from: 10, to: 5},
		    {from: 3, to: 11},
		    {from: 3, to: 12},
		    {from: 3, to: 13},
		    {from: 3, to: 14},
		    {from: 3, to: 15},
		    {from: 16, to: 12},
		    {from: 17, to: 12},
		    {from: 18, to: 12},
		    {from: 4, to: 19, label: 'FrontEnd'},
		    {from: 20, to: 19, label: 'CEO'},
		    {from: 21, to: 19, label: 'CTO'},
		    {from: 22, to: 19, label: 'ML'},
		    {from: 23, to: 19, label: 'Design'},
		    {from: 24, to: 19, label: 'Design'},
		    {from: 25, to: 19, label: 'APIs'},
		    {from: 26, to: 19, label: 'FrontEnd'},
		    {from: 27, to: 19, label: 'PM'},
		    {from: 28, to: 19, label: 'UX'},
		    {from: 2, to: 29},
		    {from: 2, to: 30},
		    {from: 2, to: 31},
		    {from: 2, to: 32},
		    {from: 2, to: 33},
		    {from: 2, to: 34},
		    {from: 2, to: 35},
		    {from: 2, to: 36},
		    {from: 4, to: 37},
		    {from: 4, to: 38},
		    {from: 4, to: 39},
		    {from: 4, to: 40},

		]
	};
};

export { Data };

//try without React, export just object





