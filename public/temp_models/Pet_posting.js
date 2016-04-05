var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");
var Schema = mongoose.Schema;

var PetPostingSchema = new Schema(
	{
	    user: {
	        type: Number,
	        ref: 'User'
	    },
	    pet: {
	        type: Number,
	        ref: 'Pet'
	    },
		title: String,
		duration: String,
		location: String,
		price: String,
		supplies: String,
		additional_info: String,
		description: String,
		thumbnail: String,
		status: String
	},
	{
	 	timestamps: { createdAt: 'created_at',
	 				  updatedAt: 'updated_at' }
	}
);

PetPostingSchema.plugin(autoIncrement.plugin, {
	model: 		'PetPosting',
	field: 		'_id',
	startAt: 	1
});

module.exports = mongoose.model("PetPosting", PetPostingSchema);