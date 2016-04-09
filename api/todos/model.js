var mongoose = require('mongoose'),
	Schema = mongoose.Schema

var todoSchema = new Schema({
	name: 'string',
	description: 'string',
	id: 'string'
})

module.exports = mongoose.model('todo', todoSchema)
