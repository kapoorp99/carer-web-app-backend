const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	city: {
		type: String,
		required: true
	},
	message: {
		type: String,
		required: true
	},
	contact: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	gotHelp: {
		type: Boolean,
		default: false
	}
},{
	timestamps: true
});

module.exports = mongoose.model('Post', postSchema);