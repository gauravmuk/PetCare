var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var SitterPostingSchema = new Schema(
	{
	    user: {
	        type: Number,
	        ref: 'User'
	    },
		title: String,
		types: String,
		duration: String,
		location: String,
		price: String,
		experience: String,
		supplies: String,
		number_of_pets: String,
		description: String,
		thumbnail: String,
		status: String
	},
	{
	 	timestamps: { createdAt: 'created_at',
	 				  updatedAt: 'updated_at' }
	}

);

SitterPostingSchema.plugin(autoIncrement.plugin, {
	model: 		'SitterPosting',
	field: 		'_id',
	startAt: 	1
});

module.exports = mongoose.model("SitterPosting", SitterPostingSchema);