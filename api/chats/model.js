'use strict';

let mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		config = require('./config');


/**
* Read CONFIGURATIONS
**/
let modelName = config.modelName;


let modelSchema = new Schema({
  id: 'string',
	message: 'string'
})

module.exports = mongoose.model(`${modelName}`, modelSchema)
