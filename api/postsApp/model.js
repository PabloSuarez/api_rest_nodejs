(() => {
	'use strict';

	let mongoose = require('mongoose'),
			Schema = mongoose.Schema,
			config = require('./config');


	/**
	* Read CONFIGURATIONS
	**/
	let modelName = config.modelName;


	let modelSchema = new Schema({
		name: 'string',
		description: 'string',
		id: 'string',
		hide: Boolean
	})

	module.exports = mongoose.model(`${modelName}`, modelSchema)
})();
