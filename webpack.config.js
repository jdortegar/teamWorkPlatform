

module.exports = {
	entry: [
		'./src/index.js'
	],
	output: {
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015', 'stage-1']
				}
			}
			
		]
	}
	
	
};